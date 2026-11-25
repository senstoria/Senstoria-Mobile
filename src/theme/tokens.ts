// Design tokens — palet Navy / White / Hot Pink.
// Keputusan founder 25 Nov 2026 19:15 WIB (dari Reel yang ia kirim):
// kombinasi Navy #0F1B3D / White #FFFFFF / Hot Pink #FF3D8B.
// Palet ini MENGGANTIKAN token D di atas putih: pink D #F4528B (fill)
// dan #C84372 (teks), serta teal ink #0A1417 dan disc #12262B.
// Perintah "buang warna pink" sebelumnya digantikan kombinasi ini —
// pink tidak hilang total, pink D diganti Hot Pink #FF3D8B.
// Ground tetap putih; Baloo 2 display dan FEEL tone 'lively' tidak berubah.
// (Ground putih sementara dari keputusan 16:57 WIB tetap berlaku; foto
// full-bleed / teal malam arah D tetap diparkir, bukan dihapus.)
//
// Kontras terukur dengan rumus WCAG (di atas #FFFFFF, kecuali disebut lain):
//   ink #0F1B3D          16.87:1  (teks utama)
//   ink-2 #55617E         6.18:1  (meta, sub)
//   ink-3 #5B6A86         5.45:1  (caps label, metadata kecil)
//   accent-text #C2185B   5.87:1  (eyebrow, link, label pink — hot pink
//                                  #FF3D8B di atas putih hanya 3.34:1,
//                                  dilarang sebagai teks; #C2185B adalah
//                                  pink yang digelapkan pada hue yang
//                                  sama, 336°)
//   on-accent #1A0A12 di atas accent fill #FF3D8B  5.74:1 (teks CTA)
//   disc ink #F7F3EA di atas disc navy #0F1B3D    15.24:1 (monogram)
// Catatan: accent-text #C2185B di atas tint hot pink #FFE3EE = 4.89:1 —
// lolos, tapi elemen pink kecil (pill tab terpilih, tag DIPAKAI) TETAP
// memakai fill pink SOLID + teks on-accent #1A0A12 (5.74:1), bukan
// tint + teks pink, demi konsistensi dengan pola sebelumnya.
export const tokens = {
  color: {
    ground: '#FFFFFF',
    ink: '#0F1B3D',
    ink2: '#55617E',
    ink3: '#5B6A86',
    rule: 'rgba(15, 27, 61, 0.14)',
    accent: '#FF3D8B',
    accentText: '#C2185B',
    onAccent: '#1A0A12',
    accentTint: '#FFE3EE',
    disc: '#0F1B3D',
    discInk: '#F7F3EA',
    glass: 'rgba(255, 255, 255, 0.92)',
    // Cincin difusi di atas putih: goresan navy sangat redup (dekoratif,
    // bukan teks — tidak ada syarat kontras). Hot pink dipakai satu cincin
    // aksen pada hero cakram. Nama kunci ringTeal adalah warisan arah D
    // (dulu teal #0A1417); nilainya kini navy, nama tidak diubah supaya
    // pemakai (HomeScreen, EmptyState) tidak berubah.
    ringTeal: ['rgba(15, 27, 61, 0.12)', 'rgba(15, 27, 61, 0.08)', 'rgba(15, 27, 61, 0.05)'],
    ringPink: ['rgba(255, 61, 139, 0.35)', 'rgba(255, 61, 139, 0.2)'],
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
