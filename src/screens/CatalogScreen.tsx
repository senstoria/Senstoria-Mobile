// Catalog — styling token D, daftar nyata dari data seed.
// Hanya 2 parfum terverifikasi; jumlah ditampilkan apa adanya.
// Search memfilter nama/merek/notes. Baris menavigasi ke Detail.
// Harga = harga referensi resmi (bukan scrape marketplace).
// Copy layar ini memakai i18n (t.mobile.catalog).
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '../i18n/locale';
import { fmt, formatCurrency } from '../i18n';
import { useStore } from '../lib/store';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { PERFUMES } from '../data/catalog';
import { Disc } from '../components/Disc';
import type { AppNavigationProp } from '../navigation/RootNavigator';

export default function CatalogScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { locale, t } = useLocale();
  const { compare, toggleCompare } = useStore();
  const L = t.mobile.catalog;
  const C = t.mobile.common;
  const CP = t.mobile.compare;
  const [query, setQuery] = useState('');

  const handleToggleCompare = (perfumeId: string) => {
    const result = toggleCompare(perfumeId);
    if (result === 'full') {
      Alert.alert(CP.limitTitle, CP.limitBody, [{ text: C.cancel, style: 'cancel' }]);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return PERFUMES;
    return PERFUMES.filter((p) =>
      `${p.brand} ${p.name} ${p.family} ${p.notes.top.join(' ')} ${p.notes.heart.join(' ')} ${p.notes.base.join(' ')}`
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, compare.length > 0 ? styles.contentWithTray : null]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>{L.title}</Text>
      <Text style={styles.subtitle}>{fmt(L.subtitle, PERFUMES.length)}</Text>

      <Pressable
        style={styles.finderCard}
        onPress={() => navigation.navigate('Finder')}
        accessibilityRole="button"
      >
        <Text style={styles.finderTitle}>{L.finderTitle}</Text>
        <Text style={styles.finderSub}>{L.finderSub}</Text>
        <Text style={styles.finderLink}>{L.finderLink}</Text>
      </Pressable>

      <View style={styles.search}>
        <Ionicons name="search" size={19} color={tokens.color.ink3} />
        <TextInput
          style={styles.searchInput}
          placeholder={L.searchPlaceholder}
          placeholderTextColor={tokens.color.ink3}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {visible.length === 0 ? (
        <Text style={styles.noResult}>{fmt(L.noResult, query.trim())}</Text>
      ) : (
        visible.map((p) => {
          const inCompare = compare.includes(p.id);
          return (
            <Pressable
              key={p.id}
              style={styles.row}
              onPress={() => navigation.navigate('Detail', { perfumeId: p.id })}
              accessibilityRole="button"
            >
              <Disc initial={p.initial} size={48} fontSize={20} />
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{p.name}</Text>
                <Text style={styles.rowMeta}>
                  {p.brand} · {p.concentration} {p.sizeMl} ml
                </Text>
                <Text style={styles.rowPrice}>{formatCurrency(p.priceIdr, locale)}</Text>
              </View>
              <Pressable
                style={[styles.compareBtn, inCompare && styles.compareBtnActive]}
                onPress={() => handleToggleCompare(p.id)}
                accessibilityRole="button"
                accessibilityLabel={inCompare ? fmt(CP.removeAria, p.name) : fmt(CP.addAria, p.name)}
              >
                <Ionicons
                  name={inCompare ? 'git-compare' : 'git-compare-outline'}
                  size={19}
                  color={inCompare ? tokens.color.onAccent : tokens.color.accentText}
                />
              </Pressable>
              <Ionicons name="chevron-forward" size={20} color={tokens.color.ink3} />
            </Pressable>
          );
        })
      )}

      <Text style={styles.footnote}>{L.footnote}</Text>
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
  title: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
  },
  subtitle: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 6 },
  finderCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 16,
  },
  finderTitle: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.ink },
  finderSub: { fontSize: tokens.type.meta, lineHeight: 21, color: tokens.color.ink2, marginTop: 4 },
  finderLink: {
    marginTop: 8,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
  search: {
    marginTop: 16,
    height: 44,
    borderRadius: tokens.radius.search,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  searchInput: { flex: 1, fontSize: tokens.type.meta, color: tokens.color.ink, height: 44 },
  noResult: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
  },
  rowText: { flex: 1, gap: 2 },
  compareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareBtnActive: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  rowName: { fontSize: tokens.type.body, fontWeight: '600', color: tokens.color.ink },
  rowMeta: { fontSize: tokens.type.note, color: tokens.color.ink2 },
  rowPrice: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  footnote: { fontSize: tokens.type.note, color: tokens.color.ink3, marginTop: 16 },
});
