// Data nyata katalog + lemari (seed kanonik, sumber: DIRECTION.md +
// verifikasi B-1 25 Nov 2026). Tidak ada angka tanpa sumber: hanya 2
// parfum terverifikasi, 1 botol aktif (valuasi Rp 350.000 — nilai dari
// verifikasi B-1, bukan hasil hitung ulang di sini), 1 wishlist.
// Harga adalah harga referensi resmi (bukan hasil scrape marketplace).
export type Perfume = {
  id: string;
  brand: string;
  name: string;
  /** Inisial merek untuk "piringan lapak" (cakram tanpa foto). */
  initial: string;
  concentration: string;
  sizeMl: number;
  priceIdr: number;
  family: string;
  notes: { top: string[]; heart: string[]; base: string[] };
};

export const PERFUMES: Perfume[] = [
  {
    id: 'hmns-the-perfection',
    brand: 'HMNS',
    name: 'The Perfection',
    initial: 'H',
    concentration: 'Eau de Parfum',
    sizeMl: 100,
    priceIdr: 633215,
    family: 'Tanpa data',
    notes: {
      top: ['Bergamot', 'Elemi', 'Cengkih Indonesia', 'Pala'],
      heart: ['Lavender', 'Tagetes', 'Lily of the Valley', 'Green Pear'],
      base: ['Driftwood', 'Sandalwood', 'Leather', 'Musk'],
    },
  },
  {
    id: 'carl-claire-enchantee',
    brand: 'Carl & Claire',
    name: 'Enchantée',
    initial: 'C',
    concentration: 'Eau de Parfum',
    sizeMl: 30,
    priceIdr: 279000,
    family: 'Floral',
    notes: {
      top: ['Citrus', 'Ginger', 'Peach'],
      heart: ['White Flowers', 'Jasmine', 'Tuberose', 'Heliotrope'],
      base: ['Ambrette', 'Musk', 'Gourmand'],
    },
  },
];

export function getPerfume(id: string): Perfume {
  const found = PERFUMES.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown perfume id: ${id}`);
  return found;
}

// Keadaan lemari founder saat ini (verifikasi B-1, 25 Nov 2026).
export const LIBRARY = {
  bottles: [
    { perfumeId: 'hmns-the-perfection', status: 'wearing' as const, addedOn: '25 Nov 2026' },
  ],
  wishlist: ['carl-claire-enchantee'],
  /** Valuasi koleksi dari verifikasi B-1 — dicatat apa adanya. */
  valuationIdr: 350000,
};

export function formatPriceIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
