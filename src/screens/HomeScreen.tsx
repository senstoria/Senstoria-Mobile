// Home — arah D di atas putih.
// Ground putih; hero GRAFIS (bukan foto): cincin difusi navy + cakram
// "piringan lapak" dengan monogram H. Foto pasar malam adalah stand-in
// dan tidak boleh dikirim ke aplikasi (DIRECTION.md) — hero grafis ini
// yang menggantikannya sampai set foto berlisensi pasar Indonesia ada.
// Konten nyata: The Perfection (dipakai hari ini, belum dicatat),
// 1 botol aktif · Rp 350.000, Enchantée di wishlist.
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { LIBRARY, PERFUMES, formatPriceIdr, getPerfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import { NotesRows } from '../components/NotesRows';
import { Rings } from '../components/Rings';
import type { AppNavigationProp } from '../navigation/RootNavigator';

const PERFECTION = getPerfume('hmns-the-perfection');
const ENCHANTEE = PERFUMES.find((p) => p.id === 'carl-claire-enchantee') as (typeof PERFUMES)[number];

function todayId(): string {
  return new Date()
    .toLocaleDateString('id-ID', {
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
  // Status tercatat bersifat lokal (UI saja). Wear log Firestore adalah
  // langkah Fase 2 — tidak ada klaim penyimpanan di sini.
  const [loggedToday, setLoggedToday] = useState(false);

  const openFinder = () => {
    Alert.alert(
      'Scent Finder',
      'Kuis pencocokan 6 dimensi hadir di Fase 2.',
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topbar}>
        <Text style={styles.date}>{todayId()}</Text>
        <Pressable
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Catalog')}
          accessibilityRole="button"
          accessibilityLabel="Cari di katalog"
        >
          <Ionicons name="search" size={21} color={tokens.color.ink} />
        </Pressable>
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
          <Disc initial={PERFECTION.initial} size={96} fontSize={40} />
        </View>
      </View>

      <Text style={styles.eyebrow}>WEWANGIAN HARI INI</Text>
      <Text
        style={[
          styles.title,
          { fontFamily: displayFontFamily(fontReady) },
        ]}
      >
        The{'\n'}Perfection
      </Text>
      <Text style={styles.meta}>
        {PERFECTION.brand} · {PERFECTION.concentration} · {PERFECTION.sizeMl} ml ·{' '}
        {formatPriceIdr(PERFECTION.priceIdr)}
      </Text>

      <NotesRows notes={PERFECTION.notes} />

      <PressableScale
        style={[styles.cta, loggedToday && styles.ctaLogged]}
        onPress={() => setLoggedToday((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={loggedToday ? 'Tercatat hari ini' : 'Catat pemakaian hari ini'}
      >
        <Text style={[styles.ctaText, loggedToday && styles.ctaTextLogged]}>
          {loggedToday ? 'Tercatat hari ini' : 'Catat pemakaian hari ini'}
        </Text>
      </PressableScale>

      <View style={styles.sub}>
        <Pressable
          style={styles.srow}
          onPress={() => navigation.navigate('Library')}
          accessibilityRole="button"
        >
          <Text style={styles.srowKey}>Perpustakaan</Text>
          <Text style={styles.srowValue}>
            {LIBRARY.bottles.length} botol aktif · {formatPriceIdr(LIBRARY.valuationIdr)}
          </Text>
        </Pressable>
        <Pressable
          style={styles.srow}
          onPress={() => navigation.navigate('Detail', { perfumeId: ENCHANTEE.id })}
          accessibilityRole="button"
        >
          <Text style={styles.srowKey}>Jelajahi</Text>
          <Text style={styles.srowValue}>
            {ENCHANTEE.name} · {ENCHANTEE.concentration} {ENCHANTEE.sizeMl} ml ·{' '}
            {formatPriceIdr(ENCHANTEE.priceIdr)}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={openFinder} accessibilityRole="button">
        <Text style={styles.finder}>Cari wewangian yang cocok →</Text>
      </Pressable>
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
  date: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: tokens.color.ink3,
  },
  searchBtn: {
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
});
