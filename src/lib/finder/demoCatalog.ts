// Pemetaan katalog demo (src/data/catalog.ts) ke bentuk kanonik
// SeedPerfume yang dipakai mesin scoring Finder. Hanya untuk kerangka
// demo — skor yang dihasilkan adalah skor terhadap 2 parfum demo.
//
// Kejujuran data: field yang tidak dinyatakan brand dibiarkan kosong
// (undefined) supaya mesin scoring menilainya NoData, bukan ditebak.
// - family: HMNS tidak menyatakan family → primary_family kosong.
// - gender_label: kedua brand tidak menyatakan → 'unknown'.
// - occasion_tags / heat_suitability / longevity_expected_band: tidak
//   dinyatakan brand → kosong.
// - projection_expected: mesin butuh angka; dipakai default netral 2
//   (skala 1–4) sebagai nilai shell demo, BUKAN fakta katalog — hanya
//   memengaruhi teks ketidakcocokan, bukan skor inti.
import type { SeedPerfume } from '../../types';
import { PERFUMES, type Perfume } from '../../data/catalog';

export function toSeedPerfume(p: Perfume): SeedPerfume {
  return {
    id: p.id,
    slug: p.id,
    name: p.name,
    brand: p.brand,
    concentration: 'EDP',
    gender_label: 'unknown',
    primary_family: p.family === 'Tanpa data' ? undefined : p.family,
    origin: 'ID',
    market_tier: 'indie',
    reference_price_idr: p.priceIdr,
    reference_price_size_ml: p.sizeMl,
    price_is_sample: false,
    top_notes: p.notes.top.join(', '),
    heart_notes: p.notes.heart.join(', '),
    base_notes: p.notes.base.join(', '),
    longevity_expected_band: 'unknown',
    projection_expected: 2,
    description_id: '',
    description_en: '',
    sample_candidate: false,
    shopee_url: '',
    tokopedia_url: '',
    data_status: 'published',
  };
}

/** Katalog demo dalam bentuk kanonik untuk mesin scoring Finder. */
export const DEMO_SEED_PERFUMES: SeedPerfume[] = PERFUMES.map(toSeedPerfume);
