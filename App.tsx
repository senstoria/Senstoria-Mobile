import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setFeelTone } from './src/lib/feel';
import { DisplayFontReadyProvider } from './src/theme/fonts';
import { tokens } from './src/theme/tokens';
import RootNavigator from './src/navigation/RootNavigator';

// FEEL tone for the whole app, set once at startup. Arah D ("night
// market") memakai 'lively' — diputuskan founder lewat arah D 25 Nov 2026
// (bukan 'soft' dari scaffold awal; D itu pasar malam: neon, ramai,
// membulat). Changing the tone is one word here.
setFeelTone('lively');

// Preview web (PR #3) tampil selebar jendela browser — founder minta
// kolom selebar HP di tengah layar. Pembatas ini HANYA untuk web:
// native mengembalikan tree yang sama persis seperti sebelumnya, tanpa
// pembungkus tambahan. Kolom membungkus seluruh aplikasi (semua layar
// + tab bar pil mengambang yang absolute di dalam navigator).
const IS_WEB = Platform.OS === 'web';

export default function App() {
  // Baloo 2 ExtraBold (display arah D) dimuat runtime lewat expo-font;
  // tidak ada file TTF yang dibundel (rute push tidak membawa biner).
  // Sampai font siap — atau bila gagal — tampilkan loading state yang
  // wajar; layar memakai font sistem sebagai fallback.
  const [fontsLoaded, fontError] = useFonts({ Baloo2_800ExtraBold });
  const fontReady = fontsLoaded && !fontError;

  const body =
    !fontsLoaded && !fontError ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={tokens.color.accent} />
      </View>
    ) : (
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: tokens.color.ground }}
      >
        <DisplayFontReadyProvider value={fontReady}>
          <StatusBar style="dark" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </DisplayFontReadyProvider>
      </GestureHandlerRootView>
    );

  if (!IS_WEB) {
    return body;
  }

  return (
    <View style={styles.webOuter}>
      <View style={styles.webColumn}>{body}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: tokens.color.ground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Latar luar kolom web: abu-abu hangat netral supaya kolom putih
  // terbaca sebagai bingkai HP. Bukan token aplikasi — hanya untuk
  // preview web, tidak dipakai di Android/iOS.
  webOuter: {
    flex: 1,
    backgroundColor: '#EDEDE8',
    alignItems: 'center',
  },
  // Kolom selebar HP di tengah halaman; tinggi penuh.
  webColumn: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    marginHorizontal: 'auto',
    backgroundColor: tokens.color.ground,
  },
});
