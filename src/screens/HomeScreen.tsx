// Home — arah D di atas Cream Grey.
// Ground Cream Grey; hero GRAFIS (bukan foto): cincin difusi navy + cakram
// "piringan lapak" dengan monogram H. Foto pasar malam adalah stand-in
// dan tidak boleh dikirim ke aplikasi (DIRECTION.md) — hero grafis ini
// yang menggantikannya sampai set foto berlisensi pasar Indonesia ada.
// Kerangka Fase 2 (demo, tanpa Firebase): hitungan Perpustakaan dan
// tombol "Catat pemakaian hari ini" memakai store lokal perangkat.
// "Wewangian hari ini" = parfum dari botol yang sedang dipakai.
// Copy layar ini memakai i18n (t.mobile.home + t.mobile.common);
// tanggal mengikuti locale aktif.
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { useStore } from '../lib/store';
import { useLocale } from '../i18n/locale';
import { fmt, formatCurrency, type Locale } from '../i18n';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { PERFUMES, getPerfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import { NotesRows } from '../components/NotesRows';
import { Rings } from '../components/Rings';
import type { AppNavigationProp } from '../navigation/RootNavigator';

const PERFECTION = getPerfume('hmns-the-perfection');
const ENCHANTEE = PERFUMES.find((p) => p.id === 'carl-claire-enchantee') as (typeof PERFUMES)[number];

function todayLabel(locale: Locale): string {
  return new Date()
    .toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();
}

export default function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { user, activeBottles, currentlyWearing, valuationIdr, compare, todayWearFor, logWear, removeTodayWear, signOut } =
    useStore();
  const { locale, t } = useLocale();
  const L = t.mobile.home;
  const C = t.mobile.common;

  // Parfum hero = parfum dari botol yang sedang dipakai; bila belum ada
  // botol, tampilkan The Perfection (parfum demo utama).
  const heroPerfume = currentlyWearing ? getPerfume(currentlyWearing.perfumeId) : PERFECTION;
  const loggedToday = currentlyWearing ? todayWearFor(currentlyWearing.id) !== undefined : false;

  const handleLogWear = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    if (!currentlyWearing) {
      Alert.alert(L.alertNoBottleTitle, L.alertNoBottleBody, [
        { text: C.cancel, style: 'cancel' },
        { text: C.alertAddBottle, onPress: () => navigation.navigate('AddBottle', {}) },
      ]);
      return;
    }
    if (loggedToday) {
      Alert.alert(C.alertLoggedTitle, fmt(C.alertLoggedBody, heroPerfume.name), [
        { text: C.cancel, style: 'cancel' },
        {
          text: C.alertDeleteLog,
          style: 'destructive',
          onPress: () => removeTodayWear(currentlyWearing.id),
        },
        { text: C.alertViewJournal, onPress: () => navigation.navigate('Journal') },
      ]);
      return;
    }
    logWear(currentlyWearing.id, currentlyWearing.perfumeId);
  };

  const handleAccount = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    Alert.alert(L.alertAccountTitle, fmt(L.alertAccountBody, user.email), [
      { text: C.cancel, style: 'cancel' },
      { text: L.alertSignOut, style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, compare.length > 0 ? styles.contentWithTray : null]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topbar}>
        <Text style={styles.date}>{todayLabel(locale)}</Text>
        <View style={styles.topbarRight}>
          <Pressable
            style={styles.iconBtn}
            onPress={handleAccount}
            accessibilityRole="button"
            accessibilityLabel={
              user ? fmt(L.accountAriaSignedIn, user.email) : L.accountAriaSignedOut
            }
          >
            <Ionicons
              name={user ? 'person' : 'person-outline'}
              size={21}
              color={user ? tokens.color.accentText : tokens.color.ink}
            />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Catalog')}
            accessibilityRole="button"
            accessibilityLabel={L.searchAria}
          >
            <Ionicons name="search" size={21} color={tokens.color.ink} />
          </Pressable>
        </View>
      </View>

      {/* Hero grafis: cincin difusi + cakram lapak (tanpa foto). */}
      <View style={styles.hero}>
        <Rings
          rings={[
            { diameter: 132, color: tokens.color.ringTeal[0] },
            { diameter: 176, color: tokens.color.ringTeal[1] },
            { diameter: 220, color: tokens.color.ringTeal[2] },
          ]}
        />
        <View style={styles.heroDisc}>
          <Disc initial={heroPerfume.initial} size={96} fontSize={40} />
        </View>
      </View>

      <Text style={styles.eyebrow}>{L.eyebrow}</Text>
      <Text
        style={[
          styles.title,
          { fontFamily: displayFontFamily(fontReady) },
        ]}
      >
        {heroPerfume.name.split(' ').join('\n')}
      </Text>
      <Text style={styles.meta}>
        {heroPerfume.brand} · {heroPerfume.concentration} · {heroPerfume.sizeMl} ml ·{' '}
        {formatCurrency(heroPerfume.priceIdr, locale)}
      </Text>

      <NotesRows notes={heroPerfume.notes} />

      <PressableScale
        style={[styles.cta, loggedToday && styles.ctaLogged]}
        onPress={handleLogWear}
        accessibilityRole="button"
        accessibilityLabel={loggedToday ? C.logWearCtaLogged : C.logWearCta}
      >
        <Text style={[styles.ctaText, loggedToday && styles.ctaTextLogged]}>
          {loggedToday ? C.logWearCtaLogged : C.logWearCta}
        </Text>
      </PressableScale>

      <View style={styles.sub}>
        <Pressable
          style={styles.srow}
          onPress={() => navigation.navigate('Library')}
          accessibilityRole="button"
        >
          <Text style={styles.srowKey}>{L.libraryRow}</Text>
          <Text style={styles.srowValue}>
            {fmt(L.libraryValue, activeBottles.length, formatCurrency(valuationIdr, locale))}
          </Text>
        </Pressable>
        <Pressable
          style={styles.srow}
          onPress={() => navigation.navigate('Detail', { perfumeId: ENCHANTEE.id })}
          accessibilityRole="button"
        >
          <Text style={styles.srowKey}>{L.exploreRow}</Text>
          <Text style={styles.srowValue}>
            {ENCHANTEE.name} · {ENCHANTEE.concentration} {ENCHANTEE.sizeMl} ml ·{' '}
            {formatCurrency(ENCHANTEE.priceIdr, locale)}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate('Finder')} accessibilityRole="button">
        <Text style={styles.finder}>{L.finderLink}</Text>
      </Pressable>
      {!user ? (
        <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
          <Text style={styles.loginHint}>{L.loginHint}</Text>
        </Pressable>
      ) : null}
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
  // Bila tray komparasi tampil (44 + jarak 8), konten bawah diberi ruang
  // tambahan supaya baris terakhir tidak tertutup tray.
  contentWithTray: { paddingBottom: tokens.spacing.contentBottom + 52 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topbarRight: { flexDirection: 'row', gap: 8 },
  date: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: tokens.color.ink3,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    marginTop: 8,
    marginBottom: 16,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDisc: { position: 'absolute' },
  eyebrow: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.accentText,
  },
  title: {
    fontSize: tokens.type.display,
    fontWeight: '800',
    lineHeight: tokens.type.display,
    letterSpacing: -0.46,
    color: tokens.color.ink,
    marginTop: 8,
  },
  meta: { fontSize: tokens.type.meta, lineHeight: 20, color: tokens.color.ink2, marginTop: 10 },
  cta: {
    marginTop: 16,
    height: 52,
    borderRadius: tokens.radius.cta,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLogged: { backgroundColor: tokens.color.disc },
  ctaText: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    letterSpacing: -0.17,
    color: tokens.color.onAccent,
  },
  ctaTextLogged: { color: tokens.color.discInk },
  sub: { marginTop: 12 },
  srow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: tokens.color.rule,
  },
  srowKey: { fontSize: tokens.type.meta, lineHeight: 20, color: tokens.color.ink2 },
  srowValue: {
    fontSize: tokens.type.meta,
    lineHeight: 20,
    fontWeight: '600',
    color: tokens.color.ink,
    textAlign: 'right',
    flexShrink: 1,
  },
  finder: {
    marginTop: 2,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
  loginHint: {
    marginTop: 12,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.ink2,
  },
});
