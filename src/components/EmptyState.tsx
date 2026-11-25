// Empty / first-run state — arah D di atas putih.
// Tampil sebagai state kondisional saat lemari kosong (0 botol, 0
// wishlist): "Pasar baru buka." Cincin difusi di belakang konten —
// komposisi mengikuti mockup (teks di dalam cincin); cincin teal sangat
// redup (0.09–0.20 di atas putih) sehingga goresannya tidak mengganggu
// keterbacaan. Penyesuaian dari mockup: di sini state hidup di dalam
// tab Library (tab bar tetap terlihat agar pengguna bisa pindah) —
// mockup menampilkan empty sebagai layar sampul tanpa tab bar.
// "Tambah botol" adalah placeholder jujur: alur tambah botol hadir di
// Fase 2 (Alert, bukan layar palsu).
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PressableScale } from '../lib/feel';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { Rings } from '../components/Rings';
import type { AppNavigationProp } from '../navigation/RootNavigator';

export function EmptyLibraryState() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  return (
    <View style={styles.host}>
      <View style={styles.ringsWrap} pointerEvents="none">
        <Rings
          rings={[
            { diameter: 280, color: tokens.color.ringTeal[0] },
            { diameter: 400, color: tokens.color.ringTeal[1] },
            { diameter: 520, color: tokens.color.ringTeal[2] },
            { diameter: 620, color: tokens.color.ringPink[1] },
          ]}
        />
      </View>
      <Text style={styles.eyebrow}>PERTAMA KALI</Text>
      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        Pasar baru{'\n'}buka.
      </Text>
      <Text style={styles.body}>
        Belum ada botol di perpustakaanmu. Tambah parfum pertamamu, atau
        jelajahi katalog dulu.
      </Text>
      <PressableScale
        style={styles.cta}
        onPress={() =>
          Alert.alert('Tambah botol', 'Alur tambah botol hadir di Fase 2.')
        }
        accessibilityRole="button"
        accessibilityLabel="Tambah botol pertama"
      >
        <Text style={styles.ctaText}>Tambah botol pertama</Text>
      </PressableScale>
      <Pressable onPress={() => navigation.navigate('Catalog')} accessibilityRole="button">
        <Text style={styles.link}>Jelajahi katalog →</Text>
      </Pressable>
      <Text style={styles.note}>Katalog berisi 2 parfum terverifikasi.</Text>
      <Pressable
        onPress={() =>
          Alert.alert('Masuk', 'Autentikasi akun hadir di Fase 2.')
        }
        accessibilityRole="button"
      >
        <Text style={styles.signin}>Sudah punya akun? Masuk</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.pad,
    backgroundColor: tokens.color.ground,
  },
  ringsWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  eyebrow: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.accentText,
    textAlign: 'center',
  },
  title: {
    fontSize: tokens.type.display,
    fontWeight: '800',
    lineHeight: tokens.type.display,
    letterSpacing: -0.46,
    color: tokens.color.ink,
    textAlign: 'center',
    marginTop: 8,
  },
  body: {
    fontSize: tokens.type.body,
    lineHeight: 23,
    color: tokens.color.ink2,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 300,
  },
  cta: {
    marginTop: 24,
    height: 52,
    paddingHorizontal: 28,
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
  link: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
  note: { fontSize: tokens.type.note, color: tokens.color.ink3, marginTop: 8 },
  signin: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 20 },
});
