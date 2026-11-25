// Library — mode daftar padat (mockup 03-library-dense).
// Search memfilter baris nyata (nama/merek). Tag status mengikuti aturan
// kontras putih: DIPAKAI = fill pink solid + teks on-accent #1A0A12
// (5.86:1); INGIN COBA = tint netral + teks ink-2 (6.08:1). Tint pink +
// teks pink tidak dipakai (hanya 4.05:1).
// "Tambah botol" = placeholder jujur (Alert Fase 2), bukan layar palsu.
// Baris bawah "Jelajahi katalog" menavigasi ke Catalog. Bila lemari
// kosong (0 botol + 0 wishlist), tampil EmptyLibraryState.
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { LIBRARY, formatPriceIdr, getPerfume, type Perfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import { EmptyLibraryState } from '../components/EmptyState';
import type { AppNavigationProp } from '../navigation/RootNavigator';

function LibraryRow({
  perfume,
  tag,
  tagStyle,
  tagTextStyle,
  onPress,
}: {
  perfume: Perfume;
  tag: string;
  tagStyle: object;
  tagTextStyle: object;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button">
      <Disc initial={perfume.initial} size={48} fontSize={20} />
      <View style={styles.rowText}>
        <Text style={styles.rowName}>{perfume.name}</Text>
        <Text style={styles.rowMeta}>
          {perfume.brand} · {perfume.concentration} {perfume.sizeMl} ml
        </Text>
      </View>
      <View style={[styles.tag, tagStyle]}>
        <Text style={[styles.tagText, tagTextStyle]}>{tag}</Text>
      </View>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const [query, setQuery] = useState('');

  const bottles = LIBRARY.bottles.map((b) => getPerfume(b.perfumeId));
  const wishlist = LIBRARY.wishlist.map((id) => getPerfume(id));
  const isEmpty = bottles.length === 0 && wishlist.length === 0;

  const matches = (p: Perfume) =>
    query.trim() === '' ||
    `${p.brand} ${p.name}`.toLowerCase().includes(query.trim().toLowerCase());
  const visibleBottles = bottles.filter(matches);
  const visibleWishlist = wishlist.filter(matches);
  const hasResults = visibleBottles.length > 0 || visibleWishlist.length > 0;

  if (isEmpty) {
    return (
      <View style={styles.emptyHost}>
        <EmptyLibraryState />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        Perpustakaan
      </Text>
      <Text style={styles.count}>
        {bottles.length} botol · {formatPriceIdr(LIBRARY.valuationIdr)}
      </Text>

      <View style={styles.search}>
        <Ionicons name="search" size={19} color={tokens.color.ink3} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari di perpustakaan"
          placeholderTextColor={tokens.color.ink3}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {!hasResults ? (
        <Text style={styles.noResult}>
          Tidak ada botol yang cocok dengan &ldquo;{query.trim()}&rdquo;.
        </Text>
      ) : (
        <>
          {visibleBottles.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SEDANG DIPAKAI</Text>
              {visibleBottles.map((p) => (
                <LibraryRow
                  key={p.id}
                  perfume={p}
                  tag="DIPAKAI"
                  tagStyle={styles.tagWearing}
                  tagTextStyle={styles.tagWearingText}
                  onPress={() => navigation.navigate('Detail', { perfumeId: p.id })}
                />
              ))}
            </View>
          ) : null}
          {visibleWishlist.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>WISHLIST</Text>
              {visibleWishlist.map((p) => (
                <LibraryRow
                  key={p.id}
                  perfume={p}
                  tag="INGIN COBA"
                  tagStyle={styles.tagWishlist}
                  tagTextStyle={styles.tagWishlistText}
                  onPress={() => navigation.navigate('Detail', { perfumeId: p.id })}
                />
              ))}
            </View>
          ) : null}
        </>
      )}

      <PressableScale
        style={styles.addBtn}
        onPress={() =>
          Alert.alert('Tambah botol', 'Alur tambah botol hadir di Fase 2.')
        }
        accessibilityRole="button"
        accessibilityLabel="Tambah botol"
      >
        <Text style={styles.addBtnText}>Tambah botol</Text>
      </PressableScale>

      <Pressable
        style={styles.catalogRow}
        onPress={() => navigation.navigate('Catalog')}
        accessibilityRole="button"
      >
        <Text style={styles.catalogText}>Jelajahi katalog — 2 parfum terverifikasi →</Text>
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
  emptyHost: { flex: 1, backgroundColor: tokens.color.ground },
  title: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
  },
  count: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 6 },
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
  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
  },
  rowText: { flex: 1 },
  rowName: { fontSize: tokens.type.body, fontWeight: '600', color: tokens.color.ink },
  rowMeta: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 2 },
  tag: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  tagText: { fontSize: tokens.type.caps, fontWeight: '700', letterSpacing: 0.8 },
  tagWearing: { backgroundColor: tokens.color.accent },
  tagWearingText: { color: tokens.color.onAccent },
  tagWishlist: { backgroundColor: 'rgba(10, 20, 23, 0.06)' },
  tagWishlistText: { color: tokens.color.ink2 },
  addBtn: {
    marginTop: 24,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.accentText },
  catalogRow: { marginTop: 16, paddingVertical: 8 },
  catalogText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.accentText },
});
