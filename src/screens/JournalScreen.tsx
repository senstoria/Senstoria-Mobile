// Journal — styling token D.
// Kerangka Fase 2 (demo, tanpa Firebase): wear log dan Scent Stories
// dibaca dari store lokal perangkat. Angka nol ditampilkan apa adanya
// (bukan disembunyikan, bukan diisi contoh). Hanya cerita TERTULIS yang
// dihitung sebagai cerita (wear log terpisah — aturan PRD).
// Copy layar ini memakai i18n (t.mobile.journal); tanggal memakai
// formatDateId(..., locale).
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PressableScale } from '../lib/feel';
import { formatDateId, useStore } from '../lib/store';
import { useLocale } from '../i18n/locale';
import { fmt } from '../i18n';
import { tokens } from '../theme/tokens';
import { useDisplayFontReady, displayFontFamily } from '../theme/fonts';
import { getPerfume } from '../data/catalog';
import type { AppNavigationProp } from '../navigation/RootNavigator';

export default function JournalScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const fontReady = useDisplayFontReady();
  const { user, bottles, wearLogs, stories, activeBottles, currentlyWearing, compare } = useStore();
  const { locale, t } = useLocale();
  const L = t.mobile.journal;

  const wearingPerfume = currentlyWearing
    ? getPerfume(currentlyWearing.perfumeId)
    : bottles.length > 0
      ? getPerfume(bottles[0]?.perfumeId ?? 'hmns-the-perfection')
      : null;

  const sortedLogs = [...wearLogs].sort((a, b) => (a.wornAt < b.wornAt ? 1 : -1));
  const sortedStories = [...stories].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const handleWriteStory = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('StoryComposer');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, compare.length > 0 ? styles.contentWithTray : null]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { fontFamily: displayFontFamily(fontReady) }]}>
        {L.title}
      </Text>
      <Text style={styles.subtitle}>{L.subtitle}</Text>

      {!user ? (
        <Pressable
          style={styles.loginBanner}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
        >
          <Text style={styles.loginBannerText}>{L.loginBanner}</Text>
        </Pressable>
      ) : null}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{wearLogs.length}</Text>
          <Text style={styles.statLabel}>{L.statWears}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{stories.length}</Text>
          <Text style={styles.statLabel}>{L.statStories}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{activeBottles.length}</Text>
          <Text style={styles.statLabel}>{L.statBottles}</Text>
        </View>
      </View>

      <View style={styles.quickLog}>
        <Text style={styles.quickLogTitle}>{L.quickLogTitle}</Text>
        {wearingPerfume ? (
          <Text style={styles.quickLogSub}>
            {wearingPerfume.name} · {wearingPerfume.brand}
          </Text>
        ) : (
          <Text style={styles.quickLogSub}>{L.quickLogEmpty}</Text>
        )}
        <PressableScale
          style={styles.quickLogCta}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel={L.quickLogCtaAria}
        >
          <Text style={styles.quickLogCtaText}>{L.quickLogCta}</Text>
        </PressableScale>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{L.sectionWears}</Text>
        {sortedLogs.length === 0 ? (
          <Text style={styles.empty}>{L.emptyWears}</Text>
        ) : (
          sortedLogs.map((log) => {
            const p = getPerfume(log.perfumeId);
            return (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logText}>
                  <Text style={styles.logName}>{p.name}</Text>
                  <Text style={styles.logMeta}>{formatDateId(log.wornAt, locale)}</Text>
                </View>
                <Text style={styles.logSprays}>{fmt(L.sprays, log.sprays)}</Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{L.sectionStories}</Text>
        {sortedStories.length === 0 ? (
          <Text style={styles.empty}>{L.emptyStories}</Text>
        ) : (
          sortedStories.map((story) => {
            const p = getPerfume(story.perfumeId);
            return (
              <View key={story.id} style={styles.storyCard}>
                <Text style={styles.storyTitle}>
                  {story.title !== '' ? story.title : L.untitledStory}
                </Text>
                <Text style={styles.storyMeta}>
                  {p.name} · {formatDateId(story.storyDate, locale)}
                </Text>
                <Text style={styles.storyBody} numberOfLines={3}>
                  {story.body}
                </Text>
              </View>
            );
          })
        )}
        <PressableScale
          style={styles.writeBtn}
          onPress={handleWriteStory}
          accessibilityRole="button"
          accessibilityLabel={L.writeButton}
        >
          <Text style={styles.writeBtnText}>{L.writeButton}</Text>
        </PressableScale>
        <Pressable
          onPress={() => navigation.navigate('Catalog')}
          accessibilityRole="button"
        >
          <Text style={styles.link}>{L.catalogLink}</Text>
        </Pressable>
      </View>
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
  loginBanner: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 12,
  },
  loginBannerText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.accentText },
  stats: {
    marginTop: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    paddingVertical: 14,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800', color: tokens.color.ink },
  statLabel: { fontSize: tokens.type.note, color: tokens.color.ink2 },
  statDivider: { width: 1, backgroundColor: tokens.color.rule },
  quickLog: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 16,
  },
  quickLogTitle: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.ink },
  quickLogSub: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 4 },
  quickLogCta: {
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLogCtaText: { fontSize: tokens.type.meta, fontWeight: '700', color: tokens.color.onAccent },
  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: tokens.type.caps,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: tokens.color.ink3,
  },
  empty: { fontSize: tokens.type.meta, color: tokens.color.ink2, marginTop: 10 },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.rule,
  },
  logText: { flex: 1 },
  logName: { fontSize: tokens.type.body, fontWeight: '600', color: tokens.color.ink },
  logMeta: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 2 },
  logSprays: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.ink },
  storyCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    borderRadius: tokens.radius.card,
    padding: 16,
  },
  storyTitle: { fontSize: tokens.type.body, fontWeight: '700', color: tokens.color.ink },
  storyMeta: { fontSize: tokens.type.note, color: tokens.color.ink2, marginTop: 4 },
  storyBody: { fontSize: tokens.type.meta, lineHeight: 21, color: tokens.color.ink, marginTop: 8 },
  writeBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeBtnText: { fontSize: tokens.type.meta, fontWeight: '600', color: tokens.color.accentText },
  link: {
    marginTop: 16,
    fontSize: tokens.type.meta,
    fontWeight: '600',
    color: tokens.color.accentText,
  },
});
