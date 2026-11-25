// Tab bar pil mengambang arah D (mockup: kapsul kaca 62pt, inset 20pt,
// bottom 34pt, radius 31). Di atas Cream Grey: kaca putih + border rule +
// bayangan lembut; tab terpilih = pill Lipstick Pink SOLID dengan ikon + label
// on-accent #1A0A12 (6.10:1). Pill pink tint + teks pink TIDAK dipakai:
// accent-text #A32668 di atas tint #FADCEF = 5.45:1 (lolos, tapi pola
// fill solid dipertahankan).
// Tab tidak terpilih: ikon + label ink-2 #4A5878 (5.82:1).
// Posisi absolute mengambang di atas konten; layar memberi
// paddingBottom 110 (tokens.spacing.contentBottom) agar konten terakhir
// tidak tertutup tab bar.
import { StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from '../lib/feel';
import { useLocale } from '../i18n/locale';
import { tokens } from '../theme/tokens';
import type { TabParamList } from '../navigation/RootNavigator';

const TABS: {
  name: keyof TabParamList;
  labelKey: 'home' | 'library' | 'journal' | 'catalog';
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: 'Home', labelKey: 'home', icon: 'home', iconOutline: 'home-outline' },
  { name: 'Library', labelKey: 'library', icon: 'library', iconOutline: 'library-outline' },
  { name: 'Journal', labelKey: 'journal', icon: 'create', iconOutline: 'create-outline' },
  { name: 'Catalog', labelKey: 'catalog', icon: 'grid', iconOutline: 'grid-outline' },
];

export default function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  const tabLabels = t.mobile.tabs;
  return (
    <View
      style={[
        styles.bar,
        { bottom: Math.max(insets.bottom, 16) },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TABS.find((t) => t.name === route.name) ?? TABS[0];
        const label = tabLabels[tab.labelKey];
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const color = focused ? tokens.color.onAccent : tokens.color.ink2;
        return (
          <PressableScale
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
          >
            <View style={[styles.tabInner, focused && styles.tabInnerFocused]}>
              <Ionicons
                name={focused ? tab.icon : tab.iconOutline}
                size={23}
                color={color}
              />
              <Text style={[styles.tabLabel, { color }]}>{label}</Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 62,
    borderRadius: tokens.radius.tabBar,
    backgroundColor: tokens.color.glass,
    borderWidth: 1,
    borderColor: tokens.color.rule,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: tokens.color.ink,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: tokens.radius.tabPill,
  },
  tabInnerFocused: { backgroundColor: tokens.color.accent },
  tabLabel: { fontSize: 10, fontWeight: '500', lineHeight: 10 },
});
