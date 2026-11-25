// Composer Scent Story — data DEMO lokal (kerangka Fase 2).
// Cerita TERTULIS tersimpan di store lokal perangkat. Hanya cerita
// tertulis yang dihitung sebagai Journal stories (aturan PRD) — wear
// log tidak dihitung sebagai cerita.
// Copy layar ini memakai i18n (t.mobile.story).
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from '../lib/feel';
import { useStore } from '../lib/store';
import { useLocale } from '../i18n/locale';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { getPerfume } from '../data/catalog';
import { Disc } from '../components/Disc';
import type { AppNavigationProp } from '../navigation/RootNavigator';

export default function StoryComposerScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { user, bottles, addStory } = useStore();
  const { t } = useLocale();
  const L = t.mobile.story;
  const C = t.mobile.common;

  // Parfum yang bisa diceritakan = parfum dari botol yang dimiliki.
  const ownedPerfumeIds = Array.from(new Set(bottles.map((b) => b.perfumeId)));
  const [perfumeId, setPerfumeId] = useState(ownedPerfumeIds[0] ?? '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const save = () => {
    if (body.trim().length < 3) {
      setError(L.errorTooShort);
      return;
    }
    if (!perfumeId) {
      setError(L.errorNoPerfume);
      return;
    }
    setError('');
    addStory({ perfumeId, title, body });
    navigation.goBack();
  };

  if (!user) {
    return (
      <View style={styles.gate}>
        <Text style={[styles.gateTitle, { fontFamily: displayFontFamily(fontReady) }]}>
          {L.gateLoginTitle}
        </Text>
        <Text style={styles.gateBody}>{L.gateLoginBody}</Text>
        <PressableScale
          style={styles.cta}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel={t.mobile.login.submitLogin}
        >
          <Text style={styles.ctaText}>{t.mobile.login.submitLogin}</Text>
        </PressableScale>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.link}>{C.cancel}</Text>
        </Pressable>
      </View>
    );
  }

  if (ownedPerfumeIds.length === 0) {
    return (
      <View style={styles.gate}>
        <Text style={[styles.gateTitle, { fontFamily: displayFontFamily(fontReady) }]}>
          {L.gateNoBottleTitle}
        </Text>
        <Text style={styles.gateBody}>{L.gateNoBottleBody}</Text>
        <PressableScale
          style={styles.cta}
          onPress={() => navigation.navigate('AddBottle', {})}
          accessibilityRole="button"
          accessibilityLabel={L.gateNoBottleCta}
        >
          <Text style={styles.ctaText}>{L.gateNoBottleCta}</Text>
        </PressableScale>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.link}>{C.cancel}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
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
        {L.title}
      </Text>
      <Text style={styles.subtitle}>{L.subtitle}</Text>

      <Text style={styles.label}>{L.perfumeLabel}</Text>
      <View style={styles.chipRow}>
        {ownedPerfumeIds.map((id) => {
          const p = getPerfume(id);
          return (
            <PressableScale
              key={id}
              style={[styles.chip, perfumeId === id && styles.chipSelected]}
              onPress={() => setPerfumeId(id)}
              accessibilityRole="button"
              accessibilityState={{ selected: perfumeId === id }}
            >
              <Disc initial={p.initial} size={28} fontSize={12} />
              <Text style={[styles.chipText, perfumeId === id && styles.chipTextSelected]}>
                {p.name}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <Text style={styles.label}>{L.titleLabel}</Text>
      <TextInput
        style={styles.input}
        placeholder={L.titlePlaceholder}
        placeholderTextColor={tokens.color.ink3}
        value={title}
        onChangeText={setTitle}
        returnKeyType="next"
      />

      <Text style={styles.label}>{L.bodyLabel}</Text>
      <TextInput
        style={[styles.input, styles.bodyInput]}
        placeholder={L.bodyPlaceholder}
        placeholderTextColor={tokens.color.ink3}
        value={body}
        onChangeText={(v) => {
          setBody(v);
          setError('');
        }}
        multiline
        textAlignVertical="top"
      />

      {error !== '' ? <Text style={styles.error}>{error}</Text> : null}

      <PressableScale
        style={styles.cta}
        onPress={save}
        accessibilityRole="button"
        accessibilityLabel={L.saveButton}
      >
        <Text style={styles.ctaText}>{L.saveButton}</Text>
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
  label: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
    marginTop: 24,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipSelected: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  chipText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  chipTextSelected: { color: tokens.color.onAccent },
  input: {
    marginTop: 8,
    minHeight: 52,
    borderRadius: tokens.radius.card,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: tokens.type.body,
    color: tokens.color.ink,
  },
  bodyInput: { minHeight: 160 },
  error: { fontSize: tokens.type.meta, color: tokens.color.accentText, marginTop: 12 },
  cta: {
    marginTop: 24,
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
  note: {
    fontSize: tokens.type.note,
    lineHeight: 18,
    color: tokens.color.ink3,
    textAlign: 'center',
    marginTop: 16,
  },
  gate: {
    flex: 1,
    backgroundColor: tokens.color.ground,
    paddingHorizontal: tokens.spacing.pad,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateTitle: {
    fontSize: tokens.type.title,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.34,
    color: tokens.color.ink,
    textAlign: 'center',
  },
  gateBody: {
    fontSize: tokens.type.body,
    lineHeight: 23,
    color: tokens.color.ink2,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 300,
  },
  link: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
});
