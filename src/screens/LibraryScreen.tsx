// Library — mode daftar padat (mockup 03-library-dense).
// Kerangka Fase 2 (demo, tanpa Firebase): botol dibaca dari store lokal
// perangkat. Tag status mengikuti aturan kontras Cream Grey: DIPAKAI = fill
// Lipstick Pink solid + teks on-accent #1A0A12 (6.10:1); TERSEGEL/HABIS/
// INGIN COBA = tint netral + teks ink-2 (5.82:1). Tint Lipstick Pink + teks
// pink tidak dipakai meski kini 5.45:1 — pola fill solid + on-accent
// dipertahankan. Search memfilter baris nyata (nama/merek). Bila lemari
// kosong (0 botol + 0 wishlist), tampil EmptyLibraryState. Ubah data
// (tambah/hapus) butuh sesi demo — bila belum masuk, arahkan ke Login.
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { useStore, type LocalBottle } from '../lib/store';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { formatPriceIdr, getPerfume, type Perfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import { EmptyLibraryState } from '../components/EmptyState';
import type { AppNavigationProp } from '../navigation/RootNavigator';

function LibraryRow({
  perfume,
  tag,
  tagStyle,
  tagTextStyle,
  remainingMl,
  onPress,
  onDelete,
}: {
  perfume: Perfume;
  tag: string;
  tagStyle: object;
  tagTextStyle: object;
  remainingMl?: number;
  onPress: () => void;
  onDelete?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.rowMain} onPress={onPress} accessibilityRole="button">
        <Disc initial={perfume.initial} size={48} fontSize={20} />
        <View style={styles.rowText}>
          <Text style={styles.rowName}>{perfume.name}</Text>
          <Text style={styles.rowMeta}>
            {perfume.brand} · {perfume.concentration} {perfume.sizeMl} ml
            {remainingMl !== undefined ? ` · sisa ${remainingMl} ml` : ''}
          </Text>
        </View>
        <View style={[styles.tag, tagStyle]}>
          <Text style={[styles.tagText, tagTextStyle]}>{tag}</Text>
        </View>
      </Pressable>
      {onDelete ? (
        <Pressable
          style={styles.deleteBtn}
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Hapus ${perfume.name} dari perpustakaan`}
        >
          <Ionicons name="trash-outline" size={19} color={tokens.color.accentText} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default function LibraryScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { user, bottles, wishlist, valuationIdr, deleteBottle } = useStore();
  const [query, setQuery] = useState('');

  const bottlePerfume = (b: LocalBottle) => getPerfume(b.perfumeId);
  const wearing = bottles.filter((b) => b.status === 'in_use');
  const sealed = bottles.filter((b) => b.status === 'sealed');
  const finished = bottles.filter((b) => b.status === 'finished');
  const wishlistPerfumes = wishlist.map((id) => getPerfume(id));
  const isEmpty = bottles.length === 0 && wishlistPerfumes.length === 0;

  const matches = (p: Perfume) =>
    query.trim() === '' ||
    `${p.brand} ${p.name}`.toLowerCase().includes(query.trim().toLowerCase());
  const visibleWearing = wearing.filter((b) => matches(bottlePerfume(b)));
  const visibleSealed = sealed.filter((b) => matches(bottlePerfume(b)));
  const visibleFinished = finished.filter((b) => matches(bottlePerfume(b)));
  const visibleWishlist = wishlistPerfumes.filter(matches);
  const hasResults =
    visibleWearing.length > 0 ||
    visibleSealed.length > 0 ||
    visibleFinished.length > 0 ||
    visibleWishlist.length > 0;

  const confirmDelete = (b: LocalBottle) => {
    const p = bottlePerfume(b);
    Alert.alert('Hapus botol?', `${p.name} (${p.brand}) akan dihapus dari perpustakaanmu. Catatan pemakaiannya ikut terhapus.`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteBottle(b.id) },
    ]);
  };

  const handleAdd = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('AddBottle', {});
  };

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
        {bottles.length} botol · {formatPriceIdr(valuationIdr)}
      </Text>

      {!user ? (
        <Pressable
          style={styles.loginBanner}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
        >
          <Text style={styles.loginBannerText}>
            Masuk untuk mengubah perpustakaanmu (mode demo) →
          </Text>
        </Pressable>
      ) : null}

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
          {visibleWearing.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SEDANG DIPAKAI</Text>
              {visibleWearing.map((b) => (
                <LibraryRow
                  key={b.id}
                  perfume={bottlePerfume(b)}
                  tag="DIPAKAI"
                  tagStyle={styles.tagWearing}
                  tagTextStyle={styles.tagWearingText}
                  remainingMl={b.remainingMl}
                  onPress={() => navigation.navigate('Detail', { perfumeId: b.perfumeId })}
                  onDelete={user ? () => confirmDelete(b) : undefined}
                />
              ))}
            </View>
          ) : null}
          {visibleSealed.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>TERSEGEL</Text>
              {visibleSealed.map((b) => (
                <LibraryRow
                  key={b.id}
                  perfume={bottlePerfume(b)}
                  tag="TERSEGEL"
                  tagStyle={styles.tagNeutral}
                  tagTextStyle={styles.tagNeutralText}
                  remainingMl={b.remainingMl}
                  onPress={() => navigation.navigate('Detail', { perfumeId: b.perfumeId })}
                  onDelete={user ? () => confirmDelete(b) : undefined}
                />
              ))}
            </View>
          ) : null}
          {visibleFinished.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>HABIS</Text>
              {visibleFinished.map((b) => (
                <LibraryRow
                  key={b.id}
                  perfume={bottlePerfume(b)}
                  tag="HABIS"
                  tagStyle={styles.tagNeutral}
                  tagTextStyle={styles.tagNeutralText}
                  remainingMl={b.remainingMl}
                  onPress={() => navigation.navigate('Detail', { perfumeId: b.perfumeId })}
                  onDelete={user ? () => confirmDelete(b) : undefined}
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
                  tagStyle={styles.tagNeutral}
                  tagTextStyle={styles.tagNeutralText}
                  onPress={() => navigation.navigate('Detail', { perfumeId: p.id })}
                />
              ))}
            </View>
          ) : null}
        </>
      )}

      <PressableScale
        style={styles.addBtn}
        onPress={handleAdd}
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
  loginBanner: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 12,
  },
  loginBannerText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.accentText },
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
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
  },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { flex: 1 },
  rowName: { fontSize: tokens.type.body, fontWeight: '600', color: tokens.color.ink },
  rowMeta: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 2 },
  tag: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  tagText: { fontSize: tokens.type.caps, fontWeight: '700', letterSpacing: 0.8 },
  tagWearing: { backgroundColor: tokens.color.accent },
  tagWearingText: { color: tokens.color.onAccent },
  tagNeutral: { backgroundColor: 'rgba(10, 20, 23, 0.06)' },
  tagNeutralText: { color: tokens.color.ink2 },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
