# Senstoria — Mobile App

Personal fragrance library & discovery, rebuilt as a native mobile app
(React Native + Expo). Fase 1 foundation scaffold.

## Stack

- Expo SDK 58 (managed workflow), React 19, React Native 0.88, TypeScript 6 (strict)
- Firebase JS SDK 13 — Auth + Firestore, project `senstoria-app` (asia-southeast2)
- React Navigation 7 (native stack)
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

## What's here (Fase 1 scaffold only)

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
  drag). Tone is set once in `App.tsx`: `setFeelTone('soft')`.
- `src/navigation/RootNavigator.tsx` + `src/screens/` — placeholder screens
  Home, Library, Journal, Catalog (title only, no real UI yet).

## What comes next (Fase 2)

Real screens (Library, Journal, Home, Catalog + Detail), auth UI (email +
Google + Apple), Firestore data layer, AsyncStorage persistence for the quiz
answers (`readSavedQuizAnswers` in the scoring module takes the saved JSON as
an argument until then), and the visual direction — decided via the App
Designer skill (the scaffold deliberately carries no design tokens yet).

## Checks

```bash
npx tsc --noEmit   # typecheck
npx expo-doctor    # diagnose dependency / config issues
```
