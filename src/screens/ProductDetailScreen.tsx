// Product Detail — arah D di atas Cream Grey, layar push (tanpa tab bar).
// Hero grafis: cakram navy + monogram + cincin Lipstick Pink (tanpa foto).
// Tombol Shopee/Tokopedia adalah tautan langsung ke pencarian
// marketplace — BUKAN tautan afiliasi (B-5 ditunda founder 25 Nov 2026),
// dan keterangannya ditulis di bawah tombol. Harga = harga referensi
// resmi, bukan hasil scrape.
// Copy layar ini memakai i18n (t.mobile.detail + t.mobile.common).
import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { useStore } from '../lib/store';
import { useLocale } from '../i18n/locale';
import { fmt, formatCurrency } from '../i18n';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { getPerfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import { NotesRows } from '../components/NotesRows';
import type { AppNavigationProp, RootStackParamList } from '../navigation/RootNavigator';

type DetailRoute = RouteProp<RootStackParamList, 'Detail'>;

export default function ProductDetailScreen({ route }: { route: DetailRoute }) {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const perfume = getPerfume(route.params.perfumeId);
  const { user, bottles, wishlist, todayWearFor, logWear, removeTodayWear } = useStore();
  const { locale, t } = useLocale();
  const L = t.mobile.detail;
  const C = t.mobile.common;
  const bottle = bottles.find((b) => b.perfumeId === perfume.id);
  const inLibrary = bottle !== undefined;
  const inWishlist = wishlist.includes(perfume.id);
  const [favorite, setFavorite] = useState(false);
  const loggedToday = bottle ? todayWearFor(bottle.id) !== undefined : false;

  const handleLogWear = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    if (!bottle) {
      Alert.alert(L.alertNoBottleTitle, fmt(L.alertNoBottleBody, perfume.name), [
        { text: C.cancel, style: 'cancel' },
        {
          text: C.alertAddBottle,
          onPress: () => navigation.navigate('AddBottle', { perfumeId: perfume.id }),
        },
      ]);
      return;
    }
    if (loggedToday) {
      Alert.alert(C.alertLoggedTitle, fmt(C.alertLoggedBody, perfume.name), [
        { text: C.cancel, style: 'cancel' },
        {
          text: C.alertDeleteLog,
          style: 'destructive',
          onPress: () => removeTodayWear(bottle.id),
        },
        { text: C.alertViewJournal, onPress: () => navigation.navigate('Journal') },
      ]);
      return;
    }
    logWear(bottle.id, bottle.perfumeId);
  };

  const openMarketplace = (where: 'shopee' | 'tokopedia') => {
    const q = encodeURIComponent(`${perfume.brand} ${perfume.name}`);
    const url =
      where === 'shopee'
        ? `https://shopee.co.id/search?keyword=${q}`
        : `https://www.tokopedia.com/search?st=product&q=${q}`;
    void Linking.openURL(url);
  };

  const sharePerfume = () => {
    void Share.share({
      message: `${perfume.name} — ${perfume.brand} ${perfume.concentration} ${perfume.sizeMl} ml, ${formatCurrency(perfume.priceIdr, locale)}`,
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topbar}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={C.backAria}
        >
          <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
        </Pressable>
        <View style={styles.topbarRight}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => setFavorite((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={favorite ? L.favoriteRemoveAria : L.favoriteAddAria}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={21}
              color={favorite ? tokens.color.accent : tokens.color.ink}
            />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={sharePerfume}
            accessibilityRole="button"
            accessibilityLabel={L.shareAria}
          >
            <Ionicons name="share-outline" size={21} color={tokens.color.ink} />
          </Pressable>
        </View>
      </View>

      <View style={styles.hero}>
        <Disc initial={perfume.initial} size={132} withRings />
      </View>

      <Text style={styles.eyebrow}>{perfume.brand.toUpperCase()}</Text>
      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        {perfume.name}
      </Text>
      <Text style={styles.meta}>
        {perfume.concentration} · {perfume.sizeMl} ml · {formatCurrency(perfume.priceIdr, locale)}
      </Text>

      <View style={styles.status}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: inLibrary ? tokens.color.accent : tokens.color.ink3 },
          ]}
        />
        <Text style={styles.statusText}>
          {inLibrary
            ? L.statusInLibrary
            : inWishlist
              ? L.statusWishlist
              : L.statusCatalog}
        </Text>
      </View>
      {bottle ? (
        <Text style={styles.statusSub}>{fmt(L.addedOn, bottle.addedOn)}</Text>
      ) : null}

      <NotesRows notes={perfume.notes} />

      <Pressable
        onPress={() => navigation.navigate('Finder')}
        accessibilityRole="button"
      >
        <Text style={styles.finder}>{L.finderLink}</Text>
      </Pressable>

      <Text style={styles.marketLabel}>{L.marketLabel}</Text>
      <View style={styles.marketRow}>
        <PressableScale
          style={styles.marketBtn}
          onPress={() => openMarketplace('shopee')}
          accessibilityRole="button"
          accessibilityLabel={L.marketShopeeAria}
        >
          <Text style={styles.marketBtnText}>Shopee</Text>
        </PressableScale>
        <PressableScale
          style={styles.marketBtn}
          onPress={() => openMarketplace('tokopedia')}
          accessibilityRole="button"
          accessibilityLabel={L.marketTokopediaAria}
        >
          <Text style={styles.marketBtnText}>Tokopedia</Text>
        </PressableScale>
      </View>
      <Text style={styles.disclosure}>{L.disclosure}</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: tokens.color.ground },
  content: {
    paddingHorizontal: tokens.spacing.pad,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topbarRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { marginVertical: 24, alignItems: 'center' },
  eyebrow: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.accentText,
  },
  title: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
    marginTop: 8,
  },
  meta: { fontSize: tokens.type.meta, lineHeight: 20, color: tokens.color.ink2, marginTop: 10 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  statusSub: { fontSize: tokens.type.note, color: tokens.color.ink3, marginTop: 4 },
  finder: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
  marketLabel: {
    marginTop: 24,
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
  },
  marketRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  marketBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketBtnText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  disclosure: { fontSize: tokens.type.note, color: tokens.color.ink3, marginTop: 8 },
  cta: {
    marginTop: 24,
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
});
