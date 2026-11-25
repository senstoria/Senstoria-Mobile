// Font display (Baloo 2 ExtraBold) — readiness context.
//
// App.tsx memuat Baloo2_800ExtraBold lewat useFonts dari
// @expo-google-fonts/baloo-2. Sampai font siap (atau bila gagal dimuat),
// teks display memakai font sistem — aplikasi tetap jalan, tidak blank.
// Layar membaca kesiapan lewat useDisplayFontReady() dan memakai
// displayFontFamily(ready) sebagai fontFamily.
import { createContext, useContext } from 'react';
import { tokens } from './tokens';

const DisplayFontReadyContext = createContext(false);

export const DisplayFontReadyProvider = DisplayFontReadyContext.Provider;

export function useDisplayFontReady(): boolean {
  return useContext(DisplayFontReadyContext);
}

export function displayFontFamily(ready: boolean): string | undefined {
  return ready ? tokens.fontFamily.display : undefined;
}
