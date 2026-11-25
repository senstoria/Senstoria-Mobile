# Sources — shared code provenance

All shared code in this scaffold is ported from the Senstoria web app:

- Repo: **senstoria/Senstoria** (public), branch `main`
- Commit: **5cb558b1** (`5cb558b106e9bc1cc751cf12db6f148aa21eec5e`, PR #61 merge,
  25 Nov 2026)
- Fetched via the GitHub connector (`get_file_contents`), 25 Nov 2026.

## Ported files

| Mobile file | Web source | Notes |
| --- | --- | --- |
| `src/types.ts` | `src/data/seedPerfumes.ts` (`CanonicalOccasionTag`, `DataStatus`, `SeedPerfume` interface) and `src/lib/derivedCalculations.ts` (`BottleState`, `WearLogState`, `StoryState`, `ReviewState`, `DiaryStats`, `ReviewSummary`, `WaitlistState`, `CollectionSummary`, `ScentDnaProfile` + aliases) | Types only, copied verbatim. No calculation functions were ported. |
| `src/lib/finder/scoring.ts` | `src/lib/scentScoring.ts` (989 lines) | Verbatim port of the deterministic 6-dimension Finder engine: weights Notes & Family 25, Climate 20, Occasion 20, Longevity 15, Gender 10, Budget 10; hard cap 96; conflict cap 79; derived-attribute cap 0.85. Two adaptations: (1) the `SeedPerfume` import retargeted to `../../types`; (2) `readSavedQuizAnswers()` no longer reads `localStorage` (a browser API that does not exist in React Native) — it now takes the saved JSON as an argument, and returns defaults when called with none. AsyncStorage wiring is a Fase 2 step. |
| `src/i18n/en.ts` | `src/lib/i18n.ts`, the `en` locale object (lines 2706–4256) | Copied verbatim, every key preserved. |
| `src/i18n/id.ts` | `src/lib/i18n.ts`, the `id` locale object (lines 1156–2705) | Copied verbatim, every key preserved. |
| `src/i18n/index.ts` | `src/lib/i18n.ts`, the `Translations` interface (lines 1–1154) and the helper functions `formatCurrency`, `formatScoreOutOfFive`, `formatDate`, `fmt`, `optionLabel` (lines 4259–4309) | Copied verbatim. The `translations` record is assembled here from `en.ts` / `id.ts` instead of holding both objects inline. Helpers use `Intl` (`NumberFormat`, `DateTimeFormat`); Hermes in React Native 0.88 supports them. |
| `src/lib/feel.tsx` | FEEL skill kit, `kit/react-native/feel.tsx` (`~/workspace/custom-skills/feel/`) | Byte-identical copy, no changes. Needs `react-native-reanimated` 4.x and `react-native-gesture-handler` 3.x (both installed); `setFeelTone('soft')` is called in `App.tsx`. |

## Not a port

- `src/lib/firebase.ts` is new. The web app's `src/lib/firebase.ts` reads
  `import.meta.env` `VITE_FIREBASE_*` variables under Vite; this file reads
  `process.env` `EXPO_PUBLIC_FIREBASE_*` variables under Expo. Same project
  (`senstoria-app`), same six config keys.
- `src/navigation/`, `src/screens/`, `App.tsx`, `index.ts`, `app.json` are
  new scaffold code.

## Verification notes

- i18n fidelity is enforced by the TypeScript compiler: `en.ts` and `id.ts`
  are both typed as `Translations`, so a missing, extra, or mistyped key in
  either locale fails `npx tsc --noEmit`.
- The scoring port keeps the web engine's exact constants and rule comments;
  the only behavioral difference is the `readSavedQuizAnswers` storage
  adaptation noted above.
