// Design tokens — palet Cream Grey / Sapphire Navy / Lipstick Pink.
// Keputusan founder 25 Nov 2026 21:02 WIB (tag "(fashion)"): kombinasi
// Cream Grey #EDE8E0 / Sapphire Navy #223366 / Lipstick Pink #EC5CAB.
// Palet ini MENGGANTIKAN palet Navy / Hot Pink dari PR #6: Navy #0F1B3D,
// ground putih #FFFFFF, dan Hot Pink #FF3D8B (teks #C2185B).
// Ground kini Cream Grey; Baloo 2 display dan FEEL tone 'lively' tidak
// berubah. (Foto full-bleed / teal malam arah D tetap diparkir, bukan
// dihapus.)
//
// Kontras terukur dengan rumus WCAG (di atas #EDE8E0, kecuali disebut lain):
//   ink #223366          9.93:1  (teks utama)
//   ink-2 #4A5878        5.82:1  (meta, sub)
//   ink-3 #55648A        4.82:1  (caps label, metadata kecil)
//   accent-text #A32668  5.67:1  (eyebrow, link, label pink — Lipstick
//                                  Pink #EC5CAB di atas Cream Grey hanya
//                                  2.58:1, dilarang sebagai teks; #A32668
//                                  adalah pink yang digelapkan pada hue
//                                  yang sama, 327°)
//   on-accent #1A0A12 di atas accent fill #EC5CAB  6.10:1 (teks CTA)
//   disc ink #F7F3EA di atas disc navy #223366    10.94:1 (monogram)
// Catatan: accent-text #A32668 di atas tint Lipstick Pink #FADCEF = 5.45:1 —
// lolos, tapi elemen pink kecil (pill tab terpilih, tag DIPAKAI) TETAP
// memakai fill pink SOLID + teks on-accent #1A0A12 (6.10:1), bukan
// tint + teks pink, demi konsistensi dengan pola sebelumnya.
export const tokens = {
  color: {
    ground: '#EDE8E0',
    ink: '#223366',
    ink2: '#4A5878',
    ink3: '#55648A',
    rule: 'rgba(34, 51, 102, 0.14)',
    accent: '#EC5CAB',
    accentText: '#A32668',
    onAccent: '#1A0A12',
    accentTint: '#FADCEF',
    disc: '#223366',
    discInk: '#F7F3EA',
    glass: 'rgba(255, 255, 255, 0.92)',
    // Cincin difusi di atas Cream Grey: goresan navy sangat redup (dekoratif,
    // bukan teks — tidak ada syarat kontras). Lipstick Pink dipakai satu cincin
    // aksen pada hero cakram. Nama kunci ringTeal adalah warisan arah D
    // (dulu teal #0A1417); nilainya kini navy, nama tidak diubah supaya
    // pemakai (HomeScreen, EmptyState) tidak berubah.
    ringTeal: ['rgba(34, 51, 102, 0.12)', 'rgba(34, 51, 102, 0.08)', 'rgba(34, 51, 102, 0.05)'],
    ringPink: ['rgba(236, 92, 171, 0.35)', 'rgba(236, 92, 171, 0.2)'],
  },
  fontFamily: {
    // Nama family persis seperti yang didaftarkan useFonts di App.tsx
    // (Baloo2_800ExtraBold dari @expo-google-fonts/baloo-2). Bila font
    // belum termuat / gagal, displayFontFamily(false) mengembalikan
    // undefined sehingga teks memakai font sistem.
    display: 'Baloo2_800ExtraBold',
  },
  // Skala teks arah D (mockup): 46 display hero, 34 judul layar,
  // 17 body, 15 meta, 13 note, 11 caps label.
  type: {
    display: 46,
    title: 34,
    body: 17,
    meta: 15,
    note: 13,
    caps: 11,
  },
  radius: {
    cta: 26,
    tabBar: 31,
    tabPill: 16,
    search: 22,
    card: 16,
    disc: 999,
  },
  spacing: {
    pad: 20,
    // Jarak konten dari bawah (mockup: clearance 104px di atas tab bar
    // mengambang yang tingginya 62px + bottom 34px).
    contentBottom: 110,
  },
} as const;

export type Tokens = typeof tokens;
