// Journal — styling token D, struktur nyata dari data seed.
// Keadaan nyata saat ini: 0 wear log, 0 Scent Story. Angka nol ditampilkan
// apa adanya (bukan disembunyikan, bukan diisi contoh). Kartu "Catat
// pemakaian hari ini" mengarah ke Beranda — di sanalah tombol catat
// berada; alur pencatatan penuh (Firestore wear log) adalah Fase 2.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PressableScale } from '../lib/feel';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { LIBRARY, getPerfume } from '../data/catalog';
import type { AppNavigationProp } from '../navigation/RootNavigator';

const WEAR_LOGS: unknown[] = [];
const STORIES: unknown[] = [];

export default function JournalScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const wearing = getPerfume(LIBRARY.bottles[0]?.perfumeId ?? 'hmns-the-perfection');

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        Buku Harian
      </Text>
      <Text style={styles.subtitle}>Catatan pemakaian &amp; cerita aroma.</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{WEAR_LOGS.length}</Text>
          <Text style={styles.statLabel}>pemakaian</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{STORIES.length}</Text>
          <Text style={styles.statLabel}>cerita</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{LIBRARY.bottles.length}</Text>
          <Text style={styles.statLabel}>botol aktif</Text>
        </View>
      </View>

      <View style={styles.quickLog}>
        <Text style={styles.quickLogTitle}>Catat pemakaian hari ini</Text>
        <Text style={styles.quickLogSub}>
          {wearing.name} · {wearing.brand}
        </Text>
        <PressableScale
          style={styles.quickLogCta}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Buka Beranda untuk mencatat"
        >
          <Text style={styles.quickLogCtaText}>Buka Beranda untuk mencatat →</Text>
        </PressableScale>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>RIWAYAT PEMAKAIAN</Text>
        {WEAR_LOGS.length === 0 ? (
          <Text style={styles.empty}>Belum ada catatan pemakaian.</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CERITA AROMA</Text>
        {STORIES.length === 0 ? (
          <Text style={styles.empty}>Belum ada cerita aroma.</Text>
        ) : null}
        <Pressable
          onPress={() => navigation.navigate('Catalog')}
          accessibilityRole="button"
        >
          <Text style={styles.link}>Jelajahi katalog →</Text>
        </Pressable>
      </View>
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
  title: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
  },
  subtitle: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 6 },
  stats: {
    marginTop: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    paddingVertical: 14,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800', color: tokens.color.ink },
  statLabel: { fontSize: tokens.type.note, color: tokens.color.ink2 },
  statDivider: { width: 1, backgroundColor: tokens.color.rule },
  quickLog: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 16,
  },
  quickLogTitle: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.ink },
  quickLogSub: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 4 },
  quickLogCta: {
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLogCtaText: { fontSize: tokens.type.meta, fontWeight: '700', color: tokens.color.onAccent },
  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
  },
  empty: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 10 },
  link: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
});
