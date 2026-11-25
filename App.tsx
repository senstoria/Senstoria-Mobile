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
// kolom selebar HP di tengah layar, lalu frame iPhone di sekelilingnya
// (PR #4). Pembatas ini HANYA untuk web: native mengembalikan tree
// yang sama persis seperti sebelumnya, tanpa pembungkus tambahan.
// Frame membungkus seluruh aplikasi (semua layar + tab bar pil
// mengambang yang absolute di dalam navigator).
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
      <View style={styles.webFrame}>
        <View style={styles.webBezelTop}>
          <View style={styles.webIsland} />
        </View>
        <View style={styles.webScreen}>{body}</View>
        <View style={styles.webBezelBottom} />
        <View style={styles.webSideBtnAction} />
        <View style={styles.webSideBtnVolume} />
        <View style={styles.webSideBtnPower} />
      </View>
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
  // Latar luar frame web: abu-abu hangat netral supaya frame perangkat
  // terbaca. Bukan token aplikasi — hanya untuk preview web, tidak
  // dipakai di Android/iOS.
  webOuter: {
    flex: 1,
    backgroundColor: '#EDEDE8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  // Frame perangkat (iPhone) untuk preview web. Lebar = layar 430 +
  // bezel 12 kiri-kanan; tinggi mengikuti viewport (viewport − 40
  // via flex + paddingVertical webOuter) — tanpa batas 932px, sesuai
  // permintaan founder; di jendela yang sangat tinggi frame ikut
  // memanjang dan tidak lagi berproporsi iPhone persis.
  // Terpusat vertikal dan horizontal oleh webOuter.
  webFrame: {
    width: '100%',
    maxWidth: 454,
    flex: 1,
    backgroundColor: '#2B2B2E',
    borderRadius: 48,
    paddingHorizontal: 12,
    boxShadow: '0 24px 64px rgba(10, 20, 23, 0.28)',
  },
  // Bezel atas 40px dengan dynamic island di tengahnya. Island berada
  // di bezelnya sendiri — tidak menutupi konten aplikasi (hero disc
  // di tengah atas layar tetap terlihat penuh).
  webBezelTop: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#2B2B2E',
  },
  webIsland: {
    width: 120,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000000',
  },
  // Layar aplikasi di dalam frame; tetap 430px, ground putih token,
  // tinggi penuh, dan tetap bisa scroll seperti biasa.
  webScreen: {
    flex: 1,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: tokens.color.ground,
  },
  // Bezel bawah 28px, polos — tanpa home indicator yang menutupi
  // tab bar pil mengambang.
  webBezelBottom: {
    height: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: '#2B2B2E',
  },
  // Tombol samping dekoratif: tombol aksi + volume di kiri, power
  // di kanan. Tipis, menonjol 3px dari sisi frame.
  webSideBtnAction: {
    position: 'absolute',
    left: -3,
    top: 120,
    width: 3,
    height: 28,
    borderRadius: 2,
    backgroundColor: '#3A3A3C',
  },
  webSideBtnVolume: {
    position: 'absolute',
    left: -3,
    top: 168,
    width: 3,
    height: 56,
    borderRadius: 2,
    backgroundColor: '#3A3A3C',
  },
  webSideBtnPower: {
    position: 'absolute',
    right: -3,
    top: 190,
    width: 3,
    height: 72,
    borderRadius: 2,
    backgroundColor: '#3A3A3C',
  },
});
