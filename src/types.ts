// Ported from Senstoria web repo (senstoria/Senstoria @ 5cb558b1), src/data/seedPerfumes.ts.
// Verbatim copy of the canonical catalog + library state types.


export type CanonicalOccasionTag = 'office' | 'casual' | 'daily' | 'date_night' | 'formal' | 'night_out' | 'sport';

export type DataStatus = 'draft' | 'verified' | 'published' | 'archived';

export interface SeedPerfume {
  id: string;
  slug: string;
  name: string;
  brand: string;
  concentration: 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Extrait';
  release_year?: number;
  gender_label: 'feminine' | 'masculine' | 'unisex' | 'unknown';
  // Family is a brand-stated fact, not a curator guess. When the brand's
  // official page does not state a family, the field stays absent and the
  // UI hides the family line (never a placeholder, never guessed).
  primary_family?: string;
  secondary_family?: string;
  origin: 'ID' | 'INT';
  // Verified brand country (canonical brands.country). Present only when
  // verified from an official brand source; absent means "not verified yet"
  // and the perfume must NOT match any Brand Origin filter selection.
  // CatalogView falls back to 'Indonesia' for origin 'ID' rows, because
  // 'ID' already classifies the brand as Indonesian local.
  brand_country?: string;
  market_tier: 'mass' | 'designer' | 'niche' | 'indie';
  reference_price_idr: number;
  reference_price_size_ml: number;
  price_is_sample: boolean;
  price_checked_date?: string; // ISO date; only for verified official prices
  top_notes: string;
  heart_notes: string;
  base_notes: string;
  // Curator estimate 1-5. Absent when not stated by the brand: the climate
  // dimension then scores as NoData (never guessed).
  heat_suitability?: number; // 1 to 5
  longevity_expected_band: '<2h' | '2-4h' | '4-6h' | '6-8h' | '8h+' | 'unknown';
  projection_expected: number; // 1 to 4
  description_id: string;
  description_en: string;
  // Brand-stated performance claim. Empty when no brand claim is verified:
  // the detail view hides the brand-claims box (never a placeholder).
  brand_claims?: string;
  sample_candidate: boolean;
  // Retired in Sprint 2: the Buy flow uses goUrl() + perfume_offers, not
  // these fields. Kept as empty strings so no seed row carries a link that
  // looks like an affiliate link; draft rows must carry no affiliate link.
  shopee_url: string;
  tokopedia_url: string;
  // Canonical catalog status (Sprint 3). Only 'published' rows appear in
  // the production catalog, Finder, compare, and detail entry points.
  data_status: DataStatus;
  source_official_url?: string;
  source_checked_date?: string; // ISO date of the official-site check
  // Founder/curator sign-off. Empty until countersigned at the gate: the
  // verification record lives in the Sprint 3 gate log, not in this field.
  verified_by?: string;
  // Canonical catalog product photo (item 9/32). A real product photo
  // ONLY when verified: the URL must point at a brand-official or
  // brand-supplied image, recorded with its source and check date.
  // Absent means "no verified real photo yet" — the UI then falls back
  // to the Bottle illustration and must never present that illustration
  // as a real photo. Never fill this from a search result, a marketplace
  // listing thumbnail, or a guess. This is NOT the manual-add
  // cover_image_data_url (device-local, see below).
  image_url?: string;
  image_source?: string; // e.g. brand official product page URL
  image_checked_date?: string; // ISO date the photo + source were verified
  // Canonical occasion tags (schema vocabulary). Absent when the brand
  // does not state usage occasions: the occasion dimension then scores as
  // NoData (never inferred from concentration/projection/family).
  occasion_tags?: CanonicalOccasionTag[];
  // Perfumer, shown only when verified from an official source.
  perfumer?: string;
  // Manual-only cover photo (work 6/32): a downscaled JPEG data URL chosen
  // in the manual-add form. This is NOT a canonical catalog image_url and
  // must never be used for catalog perfumes. Manual perfumes are stored
  // only in the user's device localStorage (see App.tsx), so this photo is
  // device-local too: it is never uploaded to Firebase Storage (the repo
  // has no Storage upload path) and never synced to a server.
  cover_image_data_url?: string;
}

export interface BottleState {
  id: string;
  user_id?: string;
  perfume_id: string;
  status: 'sealed' | 'in_use' | 'finished';
  format?: 'full' | 'decant' | 'travel' | 'vial';
  size_ml: number;
  remaining_ml: number;
  ml_per_wear?: number;
  price_idr?: number;
  // Sprint 2: NO stored wear counter. Wear counts are derived ONLY from
  // wear_logs (logs win, BR-01). A `times_worn` field here would be a
  // second source of truth and must never be reintroduced.
  is_favorite?: boolean;
  deleted_at?: string | null;
}

export interface WearLogState {
  id: string;
  user_id?: string;
  bottle_id: string;
  perfume_id: string;
  worn_at: string; // ISO date string YYYY-MM-DD or ISO timestamp (canonical §5.2 name)
  sprays?: number; // canonical §5.2 name; default 3-4 sprays (~0.4 - 0.5ml)
  ml_used?: number; // canonical §5.2 name
  compliments?: number; // count of compliments received (e.g. 1)
  longevity_hours?: number; // perceived longevity e.g. 6.5
  mood?: string; // 'Percaya Diri' | 'Santai' | 'Romantis' | 'Fokus' | 'Segar' | 'Mewah'
  occasion?: string; // 'Kantor / Kerja' | 'Kencan' | 'Kasual / Nongkrong' | 'Pesta / Formal' | 'Olahraga'
  weather?: string; // 'Panas Tropis' | 'Ruang Ber-AC' | 'Hujan Sejuk' | 'Malam Hangat'
  note?: string; // 140 chars note
  client_op_id?: string;
  deleted_at?: string | null;
}

export interface StoryState {
  id: string;
  user_id?: string;
  user_name?: string;
  perfume_id: string;
  wear_log_id?: string;
  title?: string;
  body: string;
  mood?: string;
  occasion?: string;
  weather?: string;
  tags?: string[];
  story_date?: string; // YYYY-MM-DD
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ReviewState {
  id: string;
  user_id: string;
  user_name: string;
  user_badge?: string; // 'Verified Owner' | 'Fragrance Enthusiast'
  perfume_id: string;
  rating: number; // 1-5
  longevity_band: string; // '<3 jam' | '3-6 jam' | '6-8 jam' | '8-12 jam' | '>12 jam'
  sillage: 'intimate' | 'moderate' | 'strong' | 'enormous';
  value_for_money: number; // 1-5
  repurchase_intent: 'yes_definitely' | 'maybe' | 'unlikely' | 'never';
  format_used: 'full_bottle' | 'decant' | 'sample_vial';
  title: string;
  review_text: string;
  pros?: string[];
  cons?: string[];
  status: 'approved' | 'pending_moderation' | 'flagged' | 'rejected';
  created_at: string;
  helpful_count: number;
}

export interface DiaryStats {
  totalWears: number;
  totalCompliments: number;
  totalStories: number;
  mostWornPerfumeId: string | null;
  mostWornCount: number;
  dominantMood: string | null;
  dominantOccasion: string | null;
  activeStreakDays: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  longevityDominantBand: string;
  sillageDominant: string;
  repurchaseYesRatePct: number;
  ratingCounts: Record<number, number>;
}

export interface WaitlistState {
  id: string;
  email: string;
  perfume_id: string;
  perfume_name?: string;
  brand?: string;
  size_ml: 2 | 5 | 10;
  whatsapp_number?: string;
  notification_pref?: 'whatsapp' | 'email' | 'both';
  status: 'pending_confirm' | 'active' | 'withdrawn' | 'notified';
  created_at: string;
  confirmed_at?: string;
}

export interface CollectionSummary {
  totalLibraryBottles: number;
  currentlyWearingCount: number;
  memoriesCount: number;
  favoritesCount: number;
  totalCollectionValueIdr: number;
  pricedBottlesCount: number;
  totalWearsCount: number;
  totalJournalStoriesCount: number;
  lowBottleAlertsCount: number;
}

export interface ScentDnaProfile {
  familyBreakdown: { family: string; percentage: number; count: number }[];
  familyPercentages: Record<string, number>;
  dominantFamily: string;
  topNotes: { note: string; count: number }[];
  climateSuitability: {
    tropicalOutdoorPct: number;
    officeAcPct: number;
    eveningRainPct: number;
  };
  concentrationBreakdown: { concentration: string; count: number }[];
  averageRemainingPct: number;
  totalVolumeMl: number;
  editorialPersonaId: string;
  editorialPersonaEn: string;
}

export type ScentStoryState = StoryState;
export type WearState = WearLogState;
export type ScentDnaSummary = ScentDnaProfile;
