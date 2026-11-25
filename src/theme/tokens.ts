// Design tokens — arah D "night market" DI ATAS PUTIH (sementara).
// Keputusan founder 25 Nov 2026 16:57 WIB: ground aplikasi mobile menjadi
// putih untuk saat ini. Arah D tetap arah final; yang diganti sementara
// hanya ground-nya (foto full-bleed / teal malam #0A1417 diparkir, bukan
// dihapus). Token D yang tetap: Baloo 2 display, pink neon (fill), cakram
// teal "piringan lapak", cincin difusi, tab bar pil mengambang.
//
// Kontras terukur dengan skrip WCAG (di atas #FFFFFF), tercatat juga di
// DIRECTION.md bagian "Varian D — latar putih":
//   ink #0A1417          18.66:1  (teks utama)
//   ink-2 #55665F         6.08:1  (meta, sub)
//   ink-3 #66766F         4.79:1  (caps label, metadata kecil)
//   accent-text #C84372   4.66:1  (eyebrow, link, label pink — pink D
//                                  #FF7EB0 di atas putih hanya 2.37:1,
//                                  dilarang; #C84372 adalah pink yang
//                                  digelapkan pada hue yang sama, 336°)
//   on-accent #1A0A12 di atas accent fill #F4528B  5.86:1 (teks CTA)
//   disc ink #F7F3EA di atas disc #12262B         14.17:1 (monogram)
// Catatan: accent-text #C84372 di atas tint pink #FEEAF1 hanya 4.05:1 —
// karena itu elemen pink kecil (pill tab terpilih, tag DIPAKAI) memakai
// fill pink SOLID + teks on-accent #1A0A12 (5.86:1), bukan tint + teks pink.
export const tokens = {
  color: {
    ground: '#FFFFFF',
    ink: '#0A1417',
    ink2: '#55665F',
    ink3: '#66766F',
    rule: 'rgba(10, 20, 23, 0.14)',
    accent: '#F4528B',
    accentText: '#C84372',
    onAccent: '#1A0A12',
    accentTint: '#FEEAF1',
    disc: '#12262B',
    discInk: '#F7F3EA',
    glass: 'rgba(255, 255, 255, 0.92)',
    // Cincin difusi di atas putih: goresan teal sangat redup (dekoratif,
    // bukan teks — tidak ada syarat kontras). Pink dipakai satu cincin
    // aksen pada hero cakram.
    ringTeal: ['rgba(10, 20, 23, 0.12)', 'rgba(10, 20, 23, 0.08)', 'rgba(10, 20, 23, 0.05)'],
    ringPink: ['rgba(244, 82, 139, 0.35)', 'rgba(244, 82, 139, 0.2)'],
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
