# Senstoria — Mobile App

Personal fragrance library & discovery, rebuilt as a native mobile app
(React Native + Expo). Fase 1 foundation scaffold.

## Stack

- Expo SDK 58 (managed workflow), React 19, React Native 0.88, TypeScript 6 (strict)
- Firebase JS SDK 13 — Auth + Firestore, project `senstoria-app` (asia-southeast2)
- React Navigation 7 (native stack + bottom tabs)
- Baloo 2 ExtraBold display type via `@expo-google-fonts/baloo-2` + `expo-font`
  (runtime loading; no TTF files bundled)
- react-native-reanimated 4 + react-native-gesture-handler 3 (FEEL motion kit)
- Shared code ported from the Senstoria web app — see [SOURCES.md](SOURCES.md)

## Run

```bash
npm install
cp .env.example .env   # then fill in the Firebase values (see below)
npx expo start
```

The app uses native modules (Reanimated, Gesture Handler), so it needs a
development build — it does not run fully in Expo Go:

```bash
npx expo run:android   # local, needs Android Studio
npx expo run:ios       # local, needs macOS + Xcode
# or: eas build --profile development
```

## Environment variables

Copy `.env.example` to `.env` and fill in the six values from the Firebase
console (project `senstoria-app` → Project settings → Your apps). Never
commit `.env`; it is gitignored. Without values the app still starts, but
`isFirebaseConfigured()` in `src/lib/firebase.ts` returns false and auth /
Firestore calls fail until real values are set.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Project ID (`senstoria-app`) |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | App ID |

## Design direction — D "night market" on white (25 Nov 2026)

Direction D (chosen by the founder 25 Nov 2026 16:27 WIB) is implemented
on a **white ground for now** (founder order 16:57 WIB) — the dark/photo
D ground is parked, not deleted. Tokens live in `src/theme/tokens.ts`
(ink `#0A1417`, pink accent fill `#F4528B`, darkened pink text `#C84372`
at 4.66:1 on white — the D pink `#FF7EB0` is only 2.37:1 on white and is
never used as text). Display type is Baloo 2 ExtraBold, loaded at runtime
via `@expo-google-fonts/baloo-2` + `expo-font` (no TTF files are bundled).
FEEL tone is `'lively'` (set in `App.tsx`). The hero is graphic (diffusion
rings + teal "piringan lapak" disc with the brand initial) — **no photo**:
the night-market photo is a stand-in and must not ship; a licensed
Indonesian-market photo set is an open item. Full token table + measured
contrasts: `../design-direction/DIRECTION.md`, section "Varian D — latar
putih (sementara, 25 Nov 2026)".

## What's here (Fase 1 scaffold + design D)

- `src/theme/tokens.ts` + `src/theme/fonts.tsx` — D tokens on white,
  Baloo 2 readiness context.
- `src/data/catalog.ts` — real seed data: 2 verified perfumes, 1 bottle,
  1 wishlist, valuation Rp 350.000 (B-1 verified 25 Nov 2026).
- `src/screens/` — Home, Product Detail (push screen), Library (dense
  list + search), Journal, Catalog — all with real content only, no
  placeholder numbers. Empty/first-run state renders when the library is
  empty. The Finder quiz, the add-bottle flow, and auth UI are Fase 2
  (their entry points show an honest "hadir di Fase 2" note).
- `src/components/TabBar.tsx` — floating pill bottom tab bar
  (Beranda / Perpustakaan / Jurnal / Katalog).
- `src/lib/firebase.ts` — Firebase app/auth/Firestore init from env vars,
  plus a minimal `signInWithEmail` stub. No UI yet.
- `src/lib/finder/scoring.ts` — the Finder scoring engine ported from the web
  app (6 weighted dimensions, hard cap 96, conflict cap 79). Pure TypeScript,
  no UI.
- `src/i18n/` — the full EN/ID translation set ported from the web app
  (`en.ts`, `id.ts`, `index.ts`).
- `src/types.ts` — core types: `SeedPerfume`, bottle / wear log / story /
  review state (ported from the web app).
- `src/lib/feel.tsx` — FEEL motion kit (press, sheets, toasts, page change,
  drag). Tone is set once in `App.tsx`: `setFeelTone('lively')`.
- `src/navigation/RootNavigator.tsx` — bottom tabs (floating pill tab bar)
  inside a native stack; Detail is a stack push screen (no tab bar).

## What comes next (Fase 2)

Auth UI (email + Google + Apple), Firestore data layer, AsyncStorage
persistence for the quiz answers (`readSavedQuizAnswers` in the scoring
module takes the saved JSON as an argument until then), the Finder quiz
screens, the add-bottle flow, real wear-log persistence, and the app
icon/splash PNGs (binary files — added via a route other than the
snapshot push).

## Checks

```bash
npx tsc --noEmit   # typecheck
npx expo-doctor    # diagnose dependency / config issues
npx eslint .       # lint (note: `npx expo lint` errors on an ESLint version
                   # check despite eslint 9.39.5 being installed — run
                   # `npx eslint` directly)
```
