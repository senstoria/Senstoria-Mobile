// Tambah Botol — form lengkap, data DEMO lokal (kerangka Fase 2).
// Botol tersimpan di store lokal perangkat (AsyncStorage), bukan server.
// Satu bottle record adalah satu-satunya sumber ukuran/sisa/status —
// tidak ada penghitung terpisah (aturan PRD BR-01).
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, type RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { useStore, type BottleStatus } from '../lib/store';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { PERFUMES, formatPriceIdr, type Perfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import type { AppNavigationProp, RootStackParamList } from '../navigation/RootNavigator';

type AddBottleRoute = RouteProp<RootStackParamList, 'AddBottle'>;

const SIZES = [30, 50, 75, 100];

const STATUSES: { value: BottleStatus; label: string }[] = [
  { value: 'in_use', label: 'Sedang dipakai' },
  { value: 'sealed', label: 'Tersegel' },
  { value: 'finished', label: 'Habis' },
];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </PressableScale>
  );
}

export default function AddBottleScreen({ route }: { route: AddBottleRoute }) {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { user, addBottle } = useStore();

  const initialPerfume =
    PERFUMES.find((p) => p.id === route.params?.perfumeId) ?? PERFUMES[0] as Perfume;
  const [perfume, setPerfume] = useState<Perfume>(initialPerfume);
  const [sizeMl, setSizeMl] = useState(initialPerfume.sizeMl);
  const [remaining, setRemaining] = useState(String(initialPerfume.sizeMl));
  const [status, setStatus] = useState<BottleStatus>('in_use');
  const [error, setError] = useState('');

  const pickPerfume = (p: Perfume) => {
    setPerfume(p);
    setSizeMl(p.sizeMl);
    setRemaining(String(p.sizeMl));
    setError('');
  };

  const save = () => {
    const remainingMl = Number(remaining.replace(',', '.'));
    if (!Number.isFinite(remainingMl) || remainingMl < 0 || remainingMl > sizeMl) {
      setError(`Sisa isi harus angka 0 sampai ${sizeMl} ml.`);
      return;
    }
    setError('');
    addBottle({
      perfumeId: perfume.id,
      status,
      sizeMl,
      remainingMl,
      priceIdr: perfume.priceIdr,
    });
    navigation.goBack();
  };

  if (!user) {
    return (
      <View style={styles.gate}>
        <Text style={[styles.gateTitle, { fontFamily: displayFontFamily(fontReady) }]}>
          Masuk dulu.
        </Text>
        <Text style={styles.gateBody}>
          Botol tersimpan di akun demo perangkat ini. Masuk dulu supaya botol
          yang kamu tambah tidak hilang saat ganti perangkat.
        </Text>
        <PressableScale
          style={styles.cta}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Masuk"
        >
          <Text style={styles.ctaText}>Masuk</Text>
        </PressableScale>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.link}>Batal</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topbar}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
        </Pressable>
        <Text style={styles.topbarTitle}>Tambah botol</Text>
        <View style={styles.iconBtnSpacer} />
      </View>

      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        Parfum apa?
      </Text>

      {PERFUMES.map((p) => {
        const selected = p.id === perfume.id;
        return (
          <Pressable
            key={p.id}
            style={[styles.perfumeRow, selected && styles.perfumeRowSelected]}
            onPress={() => pickPerfume(p)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Disc initial={p.initial} size={48} fontSize={20} />
            <View style={styles.perfumeText}>
              <Text style={styles.perfumeName}>{p.name}</Text>
              <Text style={styles.perfumeMeta}>
                {p.brand} · {p.concentration} {p.sizeMl} ml
              </Text>
            </View>
            <Text style={styles.perfumePrice}>{formatPriceIdr(p.priceIdr)}</Text>
          </Pressable>
        );
      })}

      <Text style={styles.label}>UKURAN BOTOL</Text>
      <View style={styles.chipRow}>
        {SIZES.map((s) => (
          <Chip
            key={s}
            label={`${s} ml`}
            selected={sizeMl === s}
            onPress={() => {
              setSizeMl(s);
              setRemaining(String(s));
              setError('');
            }}
          />
        ))}
      </View>

      <Text style={styles.label}>SISA ISI (ML)</Text>
      <TextInput
        style={styles.input}
        placeholder={`0–${sizeMl}`}
        placeholderTextColor={tokens.color.ink3}
        value={remaining}
        onChangeText={(v) => {
          setRemaining(v.replace(/[^0-9.,]/g, ''));
          setError('');
        }}
        keyboardType="decimal-pad"
        returnKeyType="done"
      />
      <Text style={styles.hint}>
        {`Sisa ${remaining || '–'} ml dari ${sizeMl} ml (${sizeMl > 0 ? Math.round(((Number(remaining.replace(',', '.')) || 0) / sizeMl) * 100) : 0}%).`}
      </Text>

      <Text style={styles.label}>STATUS</Text>
      <View style={styles.chipRow}>
        {STATUSES.map((s) => (
          <Chip
            key={s.value}
            label={s.label}
            selected={status === s.value}
            onPress={() => setStatus(s.value)}
          />
        ))}
      </View>

      {error !== '' ? <Text style={styles.error}>{error}</Text> : null}

      <PressableScale
        style={styles.cta}
        onPress={save}
        accessibilityRole="button"
        accessibilityLabel="Simpan botol"
      >
        <Text style={styles.ctaText}>Simpan botol</Text>
      </PressableScale>
      <Text style={styles.note}>
        Harga referensi {formatPriceIdr(perfume.priceIdr)} dicatat otomatis
        sebagai nilai botol.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: tokens.color.ground },
  content: {
    paddingHorizontal: tokens.spacing.pad,
    paddingTop: 10,
    paddingBottom: tokens.spacing.contentBottom,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topbarTitle: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSpacer: { width: 44, height: 44 },
  title: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
    marginTop: 16,
  },
  perfumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
  },
  perfumeRowSelected: { borderColor: tokens.color.accent, borderWidth: 2, padding: 11 },
  perfumeText: { flex: 1 },
  perfumeName: { fontSize: tokens.type.body, fontWeight: '600', color: tokens.color.ink },
  perfumeMeta: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 2 },
  perfumePrice: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  label: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
    marginTop: 24,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  chipText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  chipTextSelected: { color: tokens.color.onAccent },
  input: {
    marginTop: 8,
    height: 52,
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    paddingHorizontal: 16,
    fontSize: tokens.type.body,
    color: tokens.color.ink,
  },
  hint: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 8 },
  error: { fontSize: tokens.type.meta, color: tokens.color.accentText, marginTop: 12 },
  cta: {
    marginTop: 24,
    height: 52,
    borderRadius: tokens.radius.cta,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    letterSpacing: -0.17,
    color: tokens.color.onAccent,
  },
  note: {
    fontSize: tokens.type.note,
    lineHeight: 18,
    color: tokens.color.ink3,
    textAlign: 'center',
    marginTop: 16,
  },
  gate: {
    flex: 1,
    backgroundColor: tokens.color.ground,
    paddingHorizontal: tokens.spacing.pad,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateTitle: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
    textAlign: 'center',
  },
  gateBody: {
    fontSize: tokens.type.body,
    lineHeight: 23,
    color: tokens.color.ink2,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 300,
  },
  link: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
});
