// Demo store — kerangka aplikasi Fase 2 (Firebase DITUNDA founder
// 25 Nov 2026: "gunakan data demo dulu", "bangun kerangka app nya dulu").
//
// Semua state tinggal di perangkat ini (AsyncStorage, kunci
// 'senstoria.demo.v1') — TIDAK ADA panggilan Firebase Auth/Firestore di
// sini. Data awal = data demo katalog (2 parfum, 1 botol, Rp 350.000).
// Aturan PRD tetap berlaku untuk logika lokal: satu bottle record adalah
// satu-satunya sumber % remaining / counts / valuation, dan hanya Scent
// Stories TERTULIS yang dihitung sebagai Journal stories (wear log
// terpisah, tidak dihitung sebagai cerita).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIBRARY } from '../data/catalog';

export type BottleStatus = 'sealed' | 'in_use' | 'finished';

export type DemoUser = { email: string };

export type LocalBottle = {
  id: string;
  perfumeId: string;
  status: BottleStatus;
  sizeMl: number;
  remainingMl: number;
  priceIdr: number;
  addedOn: string;
};

export type LocalWearLog = {
  id: string;
  bottleId: string;
  perfumeId: string;
  /** Tanggal pemakaian, format lokal YYYY-MM-DD. */
  wornAt: string;
  sprays: number;
};

export type LocalStory = {
  id: string;
  perfumeId: string;
  title: string;
  body: string;
  /** Tanggal cerita ditulis, format lokal YYYY-MM-DD. */
  storyDate: string;
  createdAt: string;
};

export type StoreState = {
  user: DemoUser | null;
  bottles: LocalBottle[];
  wearLogs: LocalWearLog[];
  stories: LocalStory[];
  wishlist: string[];
};

const STORAGE_KEY = 'senstoria.demo.v1';

// Isi awal = keadaan demo yang sudah diverifikasi (B-1, 25 Nov 2026):
// 1 botol The Perfection (100 ml, penuh, nilai Rp 350.000), 1 wishlist
// Enchantée, 0 wear log, 0 cerita.
const INITIAL_STATE: StoreState = {
  user: null,
  bottles: [
    {
      id: 'demo-bottle-1',
      perfumeId: LIBRARY.bottles[0]?.perfumeId ?? 'hmns-the-perfection',
      status: 'in_use',
      sizeMl: 100,
      remainingMl: 100,
      priceIdr: LIBRARY.valuationIdr,
      addedOn: '25 Nov 2026',
    },
  ],
  wearLogs: [],
  stories: [],
  wishlist: [...LIBRARY.wishlist],
};

/** Kunci tanggal lokal YYYY-MM-DD (tanpa jam, tanpa UTC). */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** "2026-11-25" → "Rabu, 25 November 2026". */
export function formatDateId(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "25 Nov 2026" untuk label "Ditambahkan ...". */
function formatAddedOn(d = new Date()): string {
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Validasi longgar isi simpanan: rusak/sebagian → pakai isi awal. */
function parseStored(raw: string | null): StoreState {
  if (!raw) return INITIAL_STATE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return INITIAL_STATE;
    return {
      user:
        isRecord(parsed.user) && typeof parsed.user.email === 'string'
          ? { email: parsed.user.email }
          : null,
      bottles: Array.isArray(parsed.bottles) ? (parsed.bottles as LocalBottle[]) : INITIAL_STATE.bottles,
      wearLogs: Array.isArray(parsed.wearLogs) ? (parsed.wearLogs as LocalWearLog[]) : [],
      stories: Array.isArray(parsed.stories) ? (parsed.stories as LocalStory[]) : [],
      wishlist: Array.isArray(parsed.wishlist)
        ? (parsed.wishlist as string[])
        : INITIAL_STATE.wishlist,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export type AddBottleInput = {
  perfumeId: string;
  status: BottleStatus;
  sizeMl: number;
  remainingMl: number;
  priceIdr: number;
};

export type AddStoryInput = {
  perfumeId: string;
  title: string;
  body: string;
};

type StoreValue = StoreState & {
  /** True setelah isi simpanan (atau isi awal) selesai dimuat. */
  loaded: boolean;
  /** Botol yang tidak habis (status sealed/in_use). */
  activeBottles: LocalBottle[];
  /** Botol yang sedang dipakai (status in_use), bila ada. */
  currentlyWearing: LocalBottle | null;
  /** Valuasi = jumlah nilai sisa isi botol (harga × sisa/ukuran). */
  valuationIdr: number;
  todayWearFor: (bottleId: string) => LocalWearLog | undefined;
  signInDemo: (email: string) => void;
  signOut: () => void;
  addBottle: (input: AddBottleInput) => LocalBottle;
  deleteBottle: (bottleId: string) => void;
  logWear: (bottleId: string, perfumeId: string, sprays?: number) => boolean;
  removeTodayWear: (bottleId: string) => void;
  addStory: (input: AddStoryInput) => LocalStory;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);
  const saveQueued = useRef(false);
  // Cermin state untuk pengecekan sinkron di logWear (updater setState
  // berjalan asinkron, jadi nilai balik tidak boleh dibaca darinya).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!cancelled) setState(parseStored(raw));
      })
      .catch(() => {
        // Simpanan rusak/tidak bisa dibaca — lanjut dengan isi awal.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveQueued.current) return;
    saveQueued.current = true;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      .catch(() => {
        // Gagal menyimpan — state tetap hidup di memori sesi ini.
      })
      .finally(() => {
        saveQueued.current = false;
      });
  }, [state, loaded]);

  const signInDemo = useCallback((email: string) => {
    setState((s) => ({ ...s, user: { email: email.trim() } }));
  }, []);

  const signOut = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
  }, []);

  const addBottle = useCallback((input: AddBottleInput): LocalBottle => {
    const bottle: LocalBottle = {
      id: newId(),
      perfumeId: input.perfumeId,
      status: input.status,
      sizeMl: input.sizeMl,
      remainingMl: input.remainingMl,
      priceIdr: input.priceIdr,
      addedOn: formatAddedOn(),
    };
    setState((s) => ({ ...s, bottles: [bottle, ...s.bottles] }));
    return bottle;
  }, []);

  const deleteBottle = useCallback((bottleId: string) => {
    setState((s) => ({
      ...s,
      bottles: s.bottles.filter((b) => b.id !== bottleId),
      // Wear log milik botol yang dihapus ikut terhapus (riwayatnya
      // melekat pada botol). Cerita aroma tetap ada — ia melekat pada
      // parfum, bukan botol.
      wearLogs: s.wearLogs.filter((w) => w.bottleId !== bottleId),
    }));
  }, []);

  const logWear = useCallback(
    (bottleId: string, perfumeId: string, sprays = 3): boolean => {
      const today = todayKey();
      if (
        stateRef.current.wearLogs.some(
          (w) => w.bottleId === bottleId && w.wornAt === today,
        )
      ) {
        return false;
      }
      const log: LocalWearLog = {
        id: newId(),
        bottleId,
        perfumeId,
        wornAt: today,
        sprays,
      };
      setState((s) => ({ ...s, wearLogs: [log, ...s.wearLogs] }));
      return true;
    },
    [],
  );

  const removeTodayWear = useCallback((bottleId: string) => {
    const today = todayKey();
    setState((s) => ({
      ...s,
      wearLogs: s.wearLogs.filter((w) => !(w.bottleId === bottleId && w.wornAt === today)),
    }));
  }, []);

  const addStory = useCallback((input: AddStoryInput): LocalStory => {
    const story: LocalStory = {
      id: newId(),
      perfumeId: input.perfumeId,
      title: input.title.trim(),
      body: input.body.trim(),
      storyDate: todayKey(),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, stories: [story, ...s.stories] }));
    return story;
  }, []);

  const value = useMemo<StoreValue>(() => {
    const activeBottles = state.bottles.filter((b) => b.status !== 'finished');
    const currentlyWearing =
      state.bottles.find((b) => b.status === 'in_use') ?? state.bottles[0] ?? null;
    // Valuasi = nilai sisa isi tiap botol (harga × sisa/ukuran), dibulatkan.
    const valuationIdr = state.bottles.reduce(
      (sum, b) => sum + Math.round((b.priceIdr * b.remainingMl) / b.sizeMl),
      0,
    );
    return {
      ...state,
      loaded,
      activeBottles,
      currentlyWearing,
      valuationIdr,
      todayWearFor: (bottleId: string) =>
        state.wearLogs.find((w) => w.bottleId === bottleId && w.wornAt === todayKey()),
      signInDemo,
      signOut,
      addBottle,
      deleteBottle,
      logWear,
      removeTodayWear,
      addStory,
    };
  }, [state, loaded, signInDemo, signOut, addBottle, deleteBottle, logWear, removeTodayWear, addStory]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore harus dipakai di dalam <StoreProvider>.');
  return store;
}
