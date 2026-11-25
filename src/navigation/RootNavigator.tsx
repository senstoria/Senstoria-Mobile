// Root navigator — arah D: tab bar pil mengambang + Detail sebagai layar
// push (tanpa tab bar). React Navigation (native stack + bottom tabs),
// bukan Expo Router — keputusan scaffold Fase 1.
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import JournalScreen from '../screens/JournalScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FloatingTabBar from '../components/TabBar';

export type TabParamList = {
  Home: undefined;
  Library: undefined;
  Journal: undefined;
  Catalog: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Detail: { perfumeId: string };
};

/** Tipe navigasi gabungan untuk layar di dalam tab (boleh pindah tab
 *  maupun push ke Detail). */
export type AppNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Catalog" component={CatalogScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Detail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
