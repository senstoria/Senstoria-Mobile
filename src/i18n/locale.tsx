// Locale provider — mekanisme bahasa aplikasi mobile (Fase 2 i18n).
// Tidak ada `t()` di modul i18n web yang di-port: konsumsi memakai
// `translations[locale]` langsung. Provider ini menyediakan locale aktif
// + `t` lewat hook `useLocale`, mengikuti pola StoreProvider
// (Context + AsyncStorage, render langsung tanpa menunggu load).
// Pilihan bahasa tersimpan di AsyncStorage (kunci `senstoria.locale.v1`);
// tanpa simpanan, default mengikuti locale perangkat (expo-localization).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { translations, type Locale, type Translations } from './index';

const STORAGE_KEY = 'senstoria.locale.v1';

function deviceLocale(): Locale {
  const tag = getLocales()[0]?.languageTag ?? 'id';
  return tag.toLowerCase().startsWith('en') ? 'en' : 'id';
}

export interface LocaleValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id');

  useEffect(() => {
    let cancelled = false;
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (cancelled) return;
        if (saved === 'en' || saved === 'id') setLocaleState(saved);
        else setLocaleState(deviceLocale());
      })
      .catch(() => {
        if (!cancelled) setLocaleState(deviceLocale());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Gagal menyimpan — pilihan tetap hidup di memori sesi ini.
    });
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale harus dipakai di dalam <LocaleProvider>.');
  return ctx;
}
