import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setFeelTone } from './src/lib/feel';
import { StoreProvider } from './src/lib/store';
import { LocaleProvider } from './src/i18n/locale';
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

// Jam live untuk status bar web-only (format 24 jam, HH:MM). Diperbarui
// tiap detik supaya menitnya tidak beku — bukan "9:41" seperti foto
// referensi iPhone founder (25 Nov 2026).
function WebClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return <Text style={styles.webClockText}>{`${hh}:${mm}`}</Text>;
}

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
          <LocaleProvider>
            <StoreProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </StoreProvider>
          </LocaleProvider>
        </DisplayFontReadyProvider>
      </GestureHandlerRootView>
    );

  if (!IS_WEB) {
    return body;
  }

  return (
    <View style={styles.webOuter}>
      <View style={styles.webFrame}>
        <View style={styles.webScreen}>
          <View style={styles.webScreenContent}>{body}</View>
          <View style={styles.webStatusBar}>
            <WebClock />
            <View style={styles.webStatusIcons}>
              <View style={styles.webSignal}>
                <View style={[styles.webSignalBar, { height: 4 }]} />
                <View style={[styles.webSignalBar, { height: 6 }]} />
                <View style={[styles.webSignalBar, { height: 8 }]} />
                <View style={[styles.webSignalBar, { height: 10 }]} />
              </View>
              <View style={styles.webWifi}>
                <View style={[styles.webWifiArc, styles.webWifiArc1]} />
                <View style={[styles.webWifiArc, styles.webWifiArc2]} />
                <View style={[styles.webWifiArc, styles.webWifiArc3]} />
                <View style={styles.webWifiDot} />
              </View>
              <View style={styles.webBattery}>
                <View style={styles.webBatteryFill} />
                <View style={styles.webBatteryNub} />
              </View>
            </View>
          </View>
          <View style={styles.webIsland} />
        </View>
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
  // Frame perangkat (iPhone) untuk preview web. Restyle 25 Nov 2026
  // mengikuti foto referensi iPhone founder ("gunakan ini sebagai frame
  // mockup"): bezel TIPIS SERAGAM ~11px keempat sisi — pita hitam atas
  // 40px + bawah 28px dari PR #4/PR #5 dihapus (itu beda terbesar vs
  // iPhone asli). Geometri baru: layar 430×932 + bezel 11 → luar
  // 452×954. Rasio luar dikunci 452:954 lewat aspectRatio (prinsip PR #5
  // dipertahankan) supaya HP selalu berproporsi iPhone berapa pun ukuran
  // jendelanya: di jendela pendek frame menyusut proporsional (lebih
  // kecil, bukan gepeng). height '100%' = viewport − 40 (paddingVertical
  // webOuter), dibatasi maxHeight 954; lebar mengikuti rasio, dibatasi
  // maxWidth 452. Catatan: width '100%' dan flex: 1 sengaja TIDAK dipakai
  // — di CSS (react-native-web) aspect-ratio diabaikan bila width dan
  // height keduanya definitif, jadi keduanya harus auto/height saja agar
  // rasio berlaku. Tombol samping dekoratif PR #4 dihapus (dari depan,
  // iPhone asli hampir tidak menunjukkannya). Terpusat vertikal dan
  // horizontal oleh webOuter.
  webFrame: {
    height: '100%',
    aspectRatio: 452 / 954,
    maxWidth: 452,
    maxHeight: 954,
    backgroundColor: '#2B2B2E',
    borderRadius: 52,
    padding: 11,
    boxShadow: '0 24px 64px rgba(10, 20, 23, 0.28)',
  },
  // Layar aplikasi di dalam frame; tetap 430×932, ground putih token,
  // tinggi penuh, dan tetap bisa scroll seperti biasa.
  webScreen: {
    flex: 1,
    borderRadius: 42,
    overflow: 'hidden',
    backgroundColor: tokens.color.ground,
  },
  // Konten aplikasi di dalam layar: inset atas 54px supaya baris pertama
  // (tanggal Beranda) tidak tertutup status bar / island — meniru
  // safe-area native. Tab bar mengambang tetap di bawah (absolute di
  // dalam navigator).
  webScreenContent: {
    flex: 1,
    paddingTop: 54,
  },
  // Status bar web-only di dalam layar: jam live kiri, glyph kanan.
  // Island di tengah (absolute terpisah) — ketiganya meniru iPhone asli.
  // Transparan seperti aslinya: konten yang di-scroll lewat di bawahnya.
  webStatusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    zIndex: 10,
  },
  webClockText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.color.ink,
  },
  webStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  // Sinyal: 4 batang meninggi. Digambar dari View (tanpa font ikon)
  // supaya selalu ter-render di preview web.
  webSignal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 12,
  },
  webSignalBar: {
    width: 3,
    borderRadius: 1,
    backgroundColor: tokens.color.ink,
  },
  // Wifi: tiga busur (lingkaran ber-border, terpotong oleh overflow
  // hidden) + satu titik di bawah tengah.
  webWifi: {
    position: 'relative',
    width: 18,
    height: 16,
    overflow: 'hidden',
  },
  webWifiArc: {
    position: 'absolute',
    left: '50%',
    borderWidth: 1.5,
    borderColor: tokens.color.ink,
    backgroundColor: 'transparent',
  },
  webWifiArc1: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: -11,
    top: 4,
  },
  webWifiArc2: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    top: 7,
  },
  webWifiArc3: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -5,
    top: 10,
  },
  webWifiDot: {
    position: 'absolute',
    left: '50%',
    top: 12.5,
    width: 2.5,
    height: 2.5,
    marginLeft: -1.25,
    borderRadius: 1.25,
    backgroundColor: tokens.color.ink,
  },
  // Baterai: kotak ber-border + isi ~72% + nub di kanan.
  webBattery: {
    position: 'relative',
    width: 25,
    height: 12,
    borderWidth: 1.5,
    borderColor: tokens.color.ink,
    borderRadius: 3,
    padding: 1.5,
  },
  webBatteryFill: {
    flex: 1,
    width: '72%',
    borderRadius: 1,
    backgroundColor: tokens.color.ink,
  },
  webBatteryNub: {
    position: 'absolute',
    right: -4,
    top: 3,
    width: 2,
    height: 6,
    borderRadius: 1,
    backgroundColor: tokens.color.ink,
  },
  // Dynamic island di DALAM layar (absolute, menutupi konten seperti
  // iPhone asli) — diukur dari foto referensi founder 25 Nov 2026:
  // ~140×36, ~32% lebar layar, top ~12px. Sebelumnya island duduk di
  // pita bezel 40px sendiri di atas aplikasi dan tidak pernah menyentuh
  // konten.
  webIsland: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -70,
    width: 140,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    zIndex: 11,
  },
});
