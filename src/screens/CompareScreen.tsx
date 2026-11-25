// Compare — Fase 3 Discovery: bandingkan maks 3 parfum berdampingan.
// Pilihan tersimpan di demo store (senstoria.demo.v1) sehingga tetap ada
// setelah aplikasi ditutup. Atribut yang dibandingkan hanya yang benar-
// benar dibawa katalog demo (family, notes TOP/HEART/BASE, konsentrasi,
// ukuran, harga); atribut yang tidak dinyatakan brand dibiarkan kosong
// ("Tanpa data") — tidak ada nilai yang ditebak (aturan kejujuran PRD).
// Katalog demo hanya berisi 2 parfum, jadi slot ke-3 selalu tampil
// kosong dan bisa diisi dari Katalog. Copy layar ini memakai i18n
// (t.mobile.compare).
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COMPARE_MAX, useStore } from '../lib/store';
import { useLocale } from '../i18n/locale';
import { fmt, formatCurrency } from '../i18n';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { getPerfume, type Perfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import type { AppNavigationProp } from '../navigation/RootNavigator';

const LABEL_WIDTH = 116;
const COLUMN_WIDTH = 134;

type Slot = Perfume | null;

export default function CompareScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { compare, removeFromCompare } = useStore();
  const { locale, t } = useLocale();
  const L = t.mobile.compare;
  const C = t.mobile.common;

  // ID tersimpan yang sudah tidak ada di katalog dilewati (tidak pernah
  // dihapus diam-diam dari simpanan; hanya tidak ditampilkan).
  const perfumes: Perfume[] = [];
  for (const id of compare) {
    try {
      perfumes.push(getPerfume(id));
    } catch {
      // ID tidak dikenal — lewati.
    }
  }
  const slots: Slot[] = [...perfumes];
  while (slots.length < COMPARE_MAX) slots.push(null);

  const rows: { label: string; value: (p: Perfume) => string }[] = [
    { label: L.attrFamily, value: (p) => p.family },
    { label: L.attrTop, value: (p) => p.notes.top.join(' · ') || L.noData },
    { label: L.attrHeart, value: (p) => p.notes.heart.join(' · ') || L.noData },
    { label: L.attrBase, value: (p) => p.notes.base.join(' · ') || L.noData },
    { label: L.attrConcentration, value: (p) => p.concentration },
    { label: L.attrSize, value: (p) => `${p.sizeMl} ml` },
    { label: L.attrPrice, value: (p) => formatCurrency(p.priceIdr, locale) },
  ];

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
      </View>

      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>{L.title}</Text>
      <Text style={styles.subtitle}>{fmt(L.subtitle, perfumes.length)}</Text>

      {perfumes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{L.emptyTitle}</Text>
          <Text style={styles.emptyBody}>{L.emptyBody}</Text>
          <Pressable
            style={styles.emptyCta}
            onPress={() => navigation.navigate('Catalog')}
            accessibilityRole="button"
          >
            <Text style={styles.emptyCtaText}>{L.emptyCta}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.cell, styles.labelCell]} />
              {slots.map((slot, i) =>
                slot ? (
                  <View key={slot.id} style={[styles.cell, styles.valueCell]}>
                    <View style={styles.slotHead}>
                      <Pressable
                        style={styles.removeBtn}
                        onPress={() => removeFromCompare(slot.id)}
                        accessibilityRole="button"
                        accessibilityLabel={fmt(L.removeAria, slot.name)}
                      >
                        <Ionicons name="close" size={16} color={tokens.color.ink2} />
                      </Pressable>
                      <Disc initial={slot.initial} size={56} fontSize={22} />
                      <Text style={styles.slotBrand}>{slot.brand.toUpperCase()}</Text>
                      <Text style={styles.slotName}>{slot.name}</Text>
                    </View>
                  </View>
                ) : (
                  <View key={`empty-${i}`} style={[styles.cell, styles.valueCell]}>
                    <Pressable
                      style={styles.addSlot}
                      onPress={() => navigation.navigate('Catalog')}
                      accessibilityRole="button"
                      accessibilityLabel={L.addSlot}
                    >
                      <Ionicons name="add" size={22} color={tokens.color.accentText} />
                      <Text style={styles.addSlotText}>{L.addSlot}</Text>
                    </Pressable>
                  </View>
                ),
              )}
            </View>
            {rows.map((row) => (
              <View key={row.label} style={styles.tableRow}>
                <Text style={[styles.cell, styles.labelCell, styles.label]}>{row.label}</Text>
                {slots.map((slot, i) => (
                  <Text key={slot ? slot.id : `empty-${i}`} style={[styles.cell, styles.valueCell, styles.value]}>
                    {slot ? row.value(slot) : ''}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
  topbar: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
    marginTop: 12,
  },
  subtitle: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 6 },
  empty: { marginTop: 32, gap: 8 },
  emptyTitle: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.ink },
  emptyBody: { fontSize: tokens.type.meta, lineHeight: 21, color: tokens.color.ink2 },
  emptyCta: {
    marginTop: 12,
    height: 52,
    borderRadius: tokens.radius.cta,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCtaText: {
    fontSize: tokens.type.body,
    fontWeight: '700',
    letterSpacing: -0.17,
    color: tokens.color.onAccent,
  },
  table: { marginTop: 20 },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
    paddingVertical: 10,
  },
  cell: { paddingHorizontal: 6 },
  labelCell: { width: LABEL_WIDTH, justifyContent: 'center' },
  valueCell: { width: COLUMN_WIDTH },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: tokens.color.accentText,
  },
  value: { fontSize: tokens.type.note, lineHeight: 18, color: tokens.color.ink },
  slotHead: { gap: 6, alignItems: 'flex-start' },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  slotBrand: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: tokens.color.accentText,
  },
  slotName: { fontSize: tokens.type.meta, fontWeight: '700', color: tokens.color.ink },
  addSlot: {
    height: 132,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addSlotText: {
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
    textAlign: 'center',
  },
});
