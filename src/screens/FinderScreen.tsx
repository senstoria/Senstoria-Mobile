// Scent Finder — shell kuis + hasil (kerangka Fase 2).
// Skor dihitung mesin deterministik 6 dimensi (25/20/20/15/10/10,
// batas 96, batas konflik 79) terhadap KATALOG DEMO (2 parfum).
// Bukan AI/ML — pencocokan rasa yang bisa dijelaskan. Jawaban kuis
// tidak disimpan ke server (mode demo, tanpa Firebase).
// Copy memakai i18n: label opsi kuis dari t.finderQuiz.steps (id opsi
// sama persis dengan nilai jawaban), hasil dari field bilingual
// scoring (…Id/…En), sisanya dari t.mobile.finder.
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
import { useLocale } from '../i18n/locale';
import { formatCurrency, type Translations } from '../i18n';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { getPerfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import type { AppNavigationProp } from '../navigation/RootNavigator';

type Option = { value: string; label: string };

/** Label opsi kuis dari t.finderQuiz.steps, urutan tetap seperti layar
 *  mobile (id opsi sama persis dengan nilai jawaban scoring). */
function quizOptions(t: Translations, step: number, ids: string[]): Option[] {
  const stepData = t.finderQuiz.steps[step];
  return ids.map((id) => {
    const found = stepData?.options.find((o) => o.id === id);
    return { value: id, label: found?.label ?? id };
  });
}

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
  const { locale, t } = useLocale();
  const L = t.mobile.finder;
  const C = t.mobile.common;
  const [answers, setAnswers] = useState<ScentQuizAnswers>(DEFAULT_QUIZ_ANSWERS);
  const [showResults, setShowResults] = useState(false);

  const FAMILIES = quizOptions(t, 0, [
    'Woody',
    'Fresh',
    'Floral',
    'Gourmand',
    'Ambery',
    'Aromatic',
    'not_sure',
  ]);
  const CLIMATES = quizOptions(t, 1, ['outdoor_hot', 'indoor_ac', 'evening_cool', 'flexible']);
  const OCCASIONS = quizOptions(t, 2, [
    'daily_office',
    'casual_dating',
    'formal_evening',
    'outdoor_sport',
    'flexible',
  ]);
  const LONGEVITIES = quizOptions(t, 3, ['light', 'moderate', 'long', 'not_sure']);
  const GENDERS = quizOptions(t, 4, ['feminine', 'masculine', 'unisex', 'any']);
  const BUDGETS = quizOptions(t, 5, ['budget', 'mid', 'premium', 'flexible']);
  const AVOIDS = quizOptions(t, 6, [
    'none',
    'overly_sweet',
    'heavy_smoke_oud',
    'sharp_white_floral',
  ]);

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
            accessibilityLabel={C.backAria}
          >
            <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
          </Pressable>
          <Text style={styles.topbarTitle}>{L.resultsTopbar}</Text>
          <View style={styles.iconBtnSpacer} />
        </View>

        <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
          {L.resultsTitle}
        </Text>
        <Text style={styles.subtitle}>{L.resultsSubtitle}</Text>

        {results.map((r) => {
          const p = getPerfume(r.perfume.id);
          const whyFits = locale === 'id' ? r.whyFitsBulletsId : r.whyFitsBulletsEn;
          const mismatch = locale === 'id' ? r.possibleMismatchId : r.possibleMismatchEn;
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
                    {p.brand} · {formatCurrency(p.priceIdr, locale)}
                  </Text>
                </View>
                <View style={styles.score}>
                  <Text style={styles.scoreNum}>{r.matchScore}%</Text>
                  <Text style={styles.scoreLabel}>{L.scoreLabel}</Text>
                </View>
              </View>
              {whyFits.map((b) => (
                <Text key={b} style={styles.why}>
                  • {b}
                </Text>
              ))}
              <Text style={styles.mismatch}>
                {L.mismatchPrefix}
                {mismatch}
              </Text>
              <View style={styles.breakdown}>
                {r.breakdownRows
                  .filter((row) => !row.isNoData)
                  .map((row) => (
                    <View key={row.key} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>
                        {locale === 'id' ? row.labelId : row.labelEn}
                      </Text>
                      <Text style={styles.breakdownPoints}>
                        {row.points}/{row.maxPoints}
                      </Text>
                    </View>
                  ))}
              </View>
              {r.adjustment ? (
                <Text style={styles.adjustment}>
                  {locale === 'id' ? r.adjustment.reasonId : r.adjustment.reasonEn}
                </Text>
              ) : null}
            </Pressable>
          );
        })}

        <PressableScale
          style={styles.secondaryBtn}
          onPress={resetQuiz}
          accessibilityRole="button"
          accessibilityLabel={L.retryButton}
        >
          <Text style={styles.secondaryBtnText}>{L.retryButton}</Text>
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
          accessibilityLabel={C.backAria}
        >
          <Ionicons name="chevron-back" size={24} color={tokens.color.ink} />
        </Pressable>
        <Text style={styles.topbarTitle}>{L.topbarTitle}</Text>
        <View style={styles.iconBtnSpacer} />
      </View>

      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        {L.quizTitle}
      </Text>
      <Text style={styles.subtitle}>{L.quizSubtitle}</Text>

      <Section
        title={L.sectionFamily}
        options={FAMILIES}
        selected={answers.preferredFamilies}
        onSelect={(v) => toggleMulti('preferredFamilies', v, 'not_sure')}
      />
      <Section
        title={L.sectionClimate}
        options={CLIMATES}
        selected={[answers.climateSetting]}
        onSelect={(v) => setSingle('climateSetting', v)}
      />
      <Section
        title={L.sectionOccasion}
        options={OCCASIONS}
        selected={[answers.occasionSetting]}
        onSelect={(v) => setSingle('occasionSetting', v)}
      />
      <Section
        title={L.sectionLongevity}
        options={LONGEVITIES}
        selected={[answers.longevityExpectation]}
        onSelect={(v) => setSingle('longevityExpectation', v)}
      />
      <Section
        title={L.sectionGender}
        options={GENDERS}
        selected={[answers.genderPreference]}
        onSelect={(v) => setSingle('genderPreference', v)}
      />
      <Section
        title={L.sectionBudget}
        options={BUDGETS}
        selected={[answers.budgetTier]}
        onSelect={(v) => setSingle('budgetTier', v)}
      />
      <Section
        title={L.sectionAvoid}
        options={AVOIDS}
        selected={answers.avoidNotesOrTraits}
        onSelect={(v) => toggleMulti('avoidNotesOrTraits', v, 'none')}
      />

      <PressableScale
        style={styles.cta}
        onPress={() => setShowResults(true)}
        accessibilityRole="button"
        accessibilityLabel={L.cta}
      >
        <Text style={styles.ctaText}>{L.cta}</Text>
      </PressableScale>
      <Text style={styles.note}>{L.note}</Text>
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
