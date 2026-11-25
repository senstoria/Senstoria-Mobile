import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import JournalScreen from '../screens/JournalScreen';
import CatalogScreen from '../screens/CatalogScreen';

export type RootStackParamList = {
  Home: undefined;
  Library: undefined;
  Journal: undefined;
  Catalog: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Navigation skeleton (Fase 1 foundation only). The four placeholder screens
// carry a title each and no real UI yet; the visual direction is decided
// later via the App Designer skill, and real screens arrive in Fase 2.
export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="Catalog" component={CatalogScreen} />
    </Stack.Navigator>
  );
}
