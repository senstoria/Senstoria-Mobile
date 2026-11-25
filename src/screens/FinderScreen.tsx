// Scent Finder — shell kuis + hasil (kerangka Fase 2).
// Skor dihitung mesin deterministik 6 dimensi (25/20/20/15/10/10,
// batas 96, batas konflik 79) terhadap KATALOG DEMO (2 parfum).
// Bukan AI/ML — pencocokan rasa yang bisa dijelaskan. Jawaban kuis
// tidak disimpan ke server (mode demo, tanpa Firebase).
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import {
  DEFAULT_QUIZ_ANSWERS,
  rankRecommendations,
  type ScentQuizAnswers,
} from '../lib/finder/scoring';
import { DEMO_SEED_PERFUMES } from '../lib/finder/demoCatalog';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { formatPriceIdr, getPerfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import type { AppNavigationProp } from '../navigation/RootNavigator';

type Option = { value: string; label: string };

const FAMILIES: Option[] = [
  { value: 'Woody', label: 'Woody' },
  { value: 'Fresh', label: 'Segar' },
  { value: 'Floral', label: 'Floral' },
  { value: 'Gourmand', label: 'Gourmand' },
  { value: 'Ambery', label: 'Ambery' },
  { value: 'Aromatic', label: 'Aromatik' },
  { value: 'not_sure', label: 'Belum tahu' },
];

const CLIMATES: Option[] = [
  { value: 'outdoor_hot', label: 'Panas terik luar ruangan' },
  { value: 'indoor_ac', label: 'Ruangan ber-AC' },
  { value: 'evening_cool', label: 'Malam sejuk' },
  { value: 'flexible', label: 'Fleksibel' },
];

const OCCASIONS: Option[] = [
  { value: 'daily_office', label: 'Sehari-hari / kantor' },
  { value: 'casual_dating', label: 'Santai / kencan' },
  { value: 'formal_evening', label: 'Formal / malam' },
  { value: 'outdoor_sport', label: 'Olahraga luar ruangan' },
  { value: 'flexible', label: 'Fleksibel' },
];

const LONGEVITIES: Option[] = [
  { value: 'light', label: 'Ringan' },
  { value: 'moderate', label: 'Sedang' },
  { value: 'long', label: 'Tahan lama' },
  { value: 'not_sure', label: 'Belum tahu' },
];

const GENDERS: Option[] = [
  { value: 'feminine', label: 'Feminin' },
  { value: 'masculine', label: 'Maskulin' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'any', label: 'Bebas' },
];

const BUDGETS: Option[] = [
  { value: 'budget', label: 'Hemat (< Rp 250rb)' },
  { value: 'mid', label: 'Menengah (Rp 250–600rb)' },
  { value: 'premium', label: 'Premium (> Rp 600rb)' },
  { value: 'flexible', label: 'Fleksibel' },
];

const AVOIDS: Option[] = [
  { value: 'none', label: 'Tidak ada' },
  { value: 'overly_sweet', label: 'Terlalu manis' },
  { value: 'heavy_smoke_oud', label: 'Oud / dupa berat' },
  { value: 'sharp_white_floral', label: 'Floral putih tajam' },
];

function Section({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: Option[];
  selected: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.chipRow}>
        {options.map((o) => {
          const isSelected = selected.includes(o.value);
          return (
            <PressableScale
              key={o.value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(o.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {o.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

export default function FinderScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const [answers, setAnswers] = useState<ScentQuizAnswers>(DEFAULT_QUIZ_ANSWERS);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(
    () => (showResults ? rankRecommendations(DEMO_SEED_PERFUMES, answers) : []),
    [showResults, answers],
  );

  const setSingle = <K extends keyof ScentQuizAnswers>(key: K, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const toggleMulti = (
    key: 'preferredFamilies' | 'avoidNotesOrTraits',
    value: string,
    exclusiveDefault: string,
  ) => {
    setAnswers((a) => {
      const current = a[key];
      if (value === exclusiveDefault) return { ...a, [key]: [exclusiveDefault] };
      const next = current.filter((v) => v !== exclusiveDefault);
      return {
        ...a,
        [key]: next.includes(value)
          ? next.filter((v) => v !== value)
          : [...next, value],
      };
    });
  };

  const resetQuiz = () => {
    setAnswers(DEFAULT_QUIZ_ANSWERS);
    setShowResults(false);
  };

  if (showResults) {
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
            accessibilityLabel="Kembali"
          >
            <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
          </Pressable>
          <Text style={styles.topbarTitle}>Hasil pencocokan</Text>
          <View style={styles.iconBtnSpacer} />
        </View>

        <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
          Yang paling{'\n'}cocok untukmu.
        </Text>
        <Text style={styles.subtitle}>
          Skor dihitung dari katalog demo (2 parfum) — pencocokan rasa yang
          bisa dijelaskan, bukan AI.
        </Text>

        {results.map((r) => {
          const p = getPerfume(r.perfume.id);
          return (
            <Pressable
              key={r.perfume.id}
              style={styles.resultCard}
              onPress={() => navigation.navigate('Detail', { perfumeId: p.id })}
              accessibilityRole="button"
            >
              <View style={styles.resultHead}>
                <Disc initial={p.initial} size={56} fontSize={22} />
                <View style={styles.resultHeadText}>
                  <Text style={styles.resultName}>{p.name}</Text>
                  <Text style={styles.resultMeta}>
                    {p.brand} · {formatPriceIdr(p.priceIdr)}
                  </Text>
                </View>
                <View style={styles.score}>
                  <Text style={styles.scoreNum}>{r.matchScore}%</Text>
                  <Text style={styles.scoreLabel}>cocok</Text>
                </View>
              </View>
              {r.whyFitsBulletsId.map((b) => (
                <Text key={b} style={styles.why}>
                  • {b}
                </Text>
              ))}
              <Text style={styles.mismatch}>Yang mungkin kurang cocok: {r.possibleMismatchId}</Text>
              <View style={styles.breakdown}>
                {r.breakdownRows
                  .filter((row) => !row.isNoData)
                  .map((row) => (
                    <View key={row.key} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{row.labelId}</Text>
                      <Text style={styles.breakdownPoints}>
                        {row.points}/{row.maxPoints}
                      </Text>
                    </View>
                  ))}
              </View>
              {r.adjustment ? (
                <Text style={styles.adjustment}>{r.adjustment.reasonId}</Text>
              ) : null}
            </Pressable>
          );
        })}

        <PressableScale
          style={styles.secondaryBtn}
          onPress={resetQuiz}
          accessibilityRole="button"
          accessibilityLabel="Ulangi kuis"
        >
          <Text style={styles.secondaryBtnText}>Ulangi kuis</Text>
        </PressableScale>
      </ScrollView>
    );
  }

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
          accessibilityLabel="Kembali"
        >
          <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
        </Pressable>
        <Text style={styles.topbarTitle}>Scent Finder</Text>
        <View style={styles.iconBtnSpacer} />
      </View>

      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        Cari yang{'\n'}cocok denganmu.
      </Text>
      <Text style={styles.subtitle}>
        Jawab 7 pertanyaan singkat. Skor dihitung dari selera — 6 dimensi
        berbobot, bukan dari popularitas.
      </Text>

      <Section
        title="KELUARGA AROMA YANG KAMU SUKA"
        options={FAMILIES}
        selected={answers.preferredFamilies}
        onSelect={(v) => toggleMulti('preferredFamilies', v, 'not_sure')}
      />
      <Section
        title="BIASANYA DIPAKAI DI MANA"
        options={CLIMATES}
        selected={[answers.climateSetting]}
        onSelect={(v) => setSingle('climateSetting', v)}
      />
      <Section
        title="UNTUK MOMEN APA"
        options={OCCASIONS}
        selected={[answers.occasionSetting]}
        onSelect={(v) => setSingle('occasionSetting', v)}
      />
      <Section
        title="KETAHANAN YANG DIHARAPKAN"
        options={LONGEVITIES}
        selected={[answers.longevityExpectation]}
        onSelect={(v) => setSingle('longevityExpectation', v)}
      />
      <Section
        title="PREFERENSI GENDER"
        options={GENDERS}
        selected={[answers.genderPreference]}
        onSelect={(v) => setSingle('genderPreference', v)}
      />
      <Section
        title="ANGGARAN"
        options={BUDGETS}
        selected={[answers.budgetTier]}
        onSelect={(v) => setSingle('budgetTier', v)}
      />
      <Section
        title="YANG INGIN DIHINDARI"
        options={AVOIDS}
        selected={answers.avoidNotesOrTraits}
        onSelect={(v) => toggleMulti('avoidNotesOrTraits', v, 'none')}
      />

      <PressableScale
        style={styles.cta}
        onPress={() => setShowResults(true)}
        accessibilityRole="button"
        accessibilityLabel="Lihat hasil"
      >
        <Text style={styles.ctaText}>Lihat hasil</Text>
      </PressableScale>
      <Text style={styles.note}>
        Katalog demo berisi 2 parfum terverifikasi. Jawaban tidak disimpan ke
        mana pun.
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
  subtitle: { fontSize: tokens.type.body, lineHeight: 23, color: tokens.color.ink2, marginTop: 8 },
  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    minHeight: 44,
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
  cta: {
    marginTop: 28,
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
  secondaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: tokens.radius.cta,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.accentText },
  note: {
    fontSize: tokens.type.note,
    lineHeight: 18,
    color: tokens.color.ink3,
    textAlign: 'center',
    marginTop: 16,
  },
  resultCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 16,
  },
  resultHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultHeadText: { flex: 1 },
  resultName: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.ink },
  resultMeta: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 2 },
  score: { alignItems: 'center' },
  scoreNum: { fontSize: 26, fontWeight: '800', color: tokens.color.accentText },
  scoreLabel: { fontSize: tokens.type.note, color: tokens.color.ink2 },
  why: { fontSize: tokens.type.meta, lineHeight: 21, color: tokens.color.ink, marginTop: 10 },
  mismatch: { fontSize: tokens.type.meta, lineHeight: 21, color: tokens.color.ink2, marginTop: 8 },
  breakdown: { marginTop: 12, borderTopWidth: 1, borderTopColor: tokens.color.rule },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
  },
  breakdownLabel: { fontSize: tokens.type.meta, color: tokens.color.ink2 },
  breakdownPoints: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  adjustment: { fontSize: tokens.type.note, color: tokens.color.ink3, marginTop: 10 },
});
