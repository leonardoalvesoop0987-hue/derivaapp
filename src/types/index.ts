// Tipos compartilhados para o app Deriva
import type { CardCategory, CardIntensity, ReceiverRule } from "@prisma/client";

export interface CardType {
  id: string;
  deck_id: string;
  system_key: string | null;
  category: CardCategory;
  title: string;
  body: string;
  intensity: CardIntensity;
  position: number;
  is_active: boolean;
  is_invertible: boolean;
  requires_video: boolean;
  receiver_rule: ReceiverRule | null;
  metadata_json: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SessionCardType {
  id: string;
  session_id: string;
  card_id: string;
  position: number;
  status: "SHOWN" | "COMPLETED" | "SKIPPED";
  was_inverted: boolean;
  shown_at: Date;
  completed_at: Date | null;
  skipped_at: Date | null;
  metadata_json: string | null;
}

export interface SessionType {
  id: string;
  user_id: string;
  deck_id: string;
  mode: "PADRAO" | "ESTREIA" | "PERSONALIZADO";
  length: "CURTA" | "MEDIA" | "COMPLETA";
  status: "ACTIVE" | "COMPLETED" | "ABORTED";
  max_intensity: CardIntensity;
  videos_enabled: boolean;
  music_enabled: boolean;
  target_card_count: number;
  current_position: number;
  last_card_id: string | null;
  completed_card_count: number;
  skips_used: number;
  inversions_used: number;
  started_at: Date;
  ended_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface MediaAssetType {
  id: string;
  type: "VIDEO" | "MUSIC";
  video_category: string | null;
  music_mood: string | null;
  storage_key: string;
  public_url: string | null;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number | null;
  weight: number;
  is_active: boolean;
  internal_label: string | null;
  original_filename: string | null;
  created_at: Date;
  updated_at: Date;
}
