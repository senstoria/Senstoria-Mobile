import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setFeelTone } from './src/lib/feel';
import RootNavigator from './src/navigation/RootNavigator';

// FEEL tone for the whole app, set once at startup. "soft" fits a calm,
// premium fragrance library (crisp = tools/work, lively = social/fun).
// Changing the tone is one word here.
setFeelTone('soft');

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
