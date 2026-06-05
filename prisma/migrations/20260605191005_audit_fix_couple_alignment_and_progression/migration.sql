-- CreateEnum
CREATE TYPE "CardCategory" AS ENUM ('AZUL', 'DERIVA', 'ROSA', 'ROXO', 'VERMELHO', 'PRETO');

-- CreateEnum
CREATE TYPE "CardIntensity" AS ENUM ('LEVE', 'QUENTE', 'INTENSO', 'PICO');

-- CreateEnum
CREATE TYPE "DeckType" AS ENUM ('SYSTEM', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SessionMode" AS ENUM ('PADRAO', 'ESTREIA', 'PERSONALIZADO', 'COM_PREFERENCIAS');

-- CreateEnum
CREATE TYPE "CardTag" AS ENUM ('MASSAGEM', 'TOQUE_LEVE', 'TOQUE_INTIMO', 'BEIJO', 'RESPIRO', 'CONEXAO', 'COMANDO_DELA', 'COMANDO_DELE', 'CONTROLE_DELA', 'CONTROLE_DELE', 'FOCO_NELA', 'FOCO_NELE', 'FOCO_CASAL', 'ORAL_NELA', 'ORAL_NELE', 'MAOS_NELA', 'MAOS_NELE', 'PENETRACAO', 'SEM_PENETRACAO', 'VIDEO', 'FANTASIA', 'ROLEPLAY', 'PROVOCACAO', 'PROIBICAO', 'DIRTY_TALK', 'IMAGINACAO', 'TERCEIRO_IMAGINARIO', 'COPIAR_ENERGIA', 'DOMINANCIA_LEVE', 'SUBMISSAO_LEVE', 'PICO', 'FECHAMENTO');

-- CreateEnum
CREATE TYPE "SessionStage" AS ENUM ('OPENING', 'WARMUP', 'TEASING', 'BUILDUP', 'INTENSE', 'PEAK', 'COOLDOWN', 'CLOSING');

-- CreateEnum
CREATE TYPE "EroticFunction" AS ENUM ('PREPARO', 'PROVOCACAO', 'PRAZER_NELA', 'PRAZER_NELE', 'PRAZER_CASAL', 'TRANSICAO', 'RESPIRO', 'FANTASIA', 'VIDEO_ESTIMULO', 'PICO', 'FECHAMENTO');

-- CreateEnum
CREATE TYPE "BodyFocus" AS ENUM ('GERAL', 'BOCA', 'MAOS', 'CORPO', 'GENITAL', 'PENETRACAO', 'MENTAL', 'VISUAL');

-- CreateEnum
CREATE TYPE "RecipientFocus" AS ENUM ('ELA', 'ELE', 'CASAL', 'SORTEADO');

-- CreateEnum
CREATE TYPE "ProgressionRole" AS ENUM ('ABRIR', 'AQUECER', 'PROVOCAR', 'INTENSIFICAR', 'SUSTENTAR', 'PICO', 'RESPIRAR', 'FECHAR');

-- CreateEnum
CREATE TYPE "SessionLength" AS ENUM ('CURTA', 'MEDIA', 'COMPLETA');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABORTED');

-- CreateEnum
CREATE TYPE "SessionCardStatus" AS ENUM ('QUEUED', 'SHOWN', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('FAVORITE', 'NEUTRAL', 'NEVER_AGAIN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'MUSIC');

-- CreateEnum
CREATE TYPE "VideoCategory" AS ENUM ('LESBICO', 'FFM', 'MMF', 'MF');

-- CreateEnum
CREATE TYPE "VideoContentType" AS ENUM ('ORAL_ONLY', 'PENETRATION_ONLY', 'COMPLETE');

-- CreateEnum
CREATE TYPE "MediaProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'ERROR', 'DISABLED');

-- CreateEnum
CREATE TYPE "MusicMood" AS ENUM ('RELAXANTE', 'SENSUAL', 'INTENSA');

-- CreateEnum
CREATE TYPE "ReceiverRule" AS ENUM ('NONE', 'WOMAN', 'MAN', 'ANY');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('WOMAN', 'MAN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "password_hash" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decks" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT,
    "system_key" TEXT,
    "name" TEXT NOT NULL,
    "type" "DeckType" NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "system_key" TEXT,
    "category" "CardCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "intensity" "CardIntensity" NOT NULL,
    "position" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_invertible" BOOLEAN NOT NULL DEFAULT false,
    "requires_video" BOOLEAN NOT NULL DEFAULT false,
    "receiver_rule" "ReceiverRule",
    "metadata_json" TEXT,
    "primary_tag" "CardTag",
    "secondary_tags" "CardTag"[] DEFAULT ARRAY[]::"CardTag"[],
    "stage" "SessionStage",
    "erotic_function" "EroticFunction",
    "body_focus" "BodyFocus",
    "recipient_focus" "RecipientFocus",
    "progression_role" "ProgressionRole",
    "cooldown_allowed" BOOLEAN NOT NULL DEFAULT false,
    "closing_allowed" BOOLEAN NOT NULL DEFAULT false,
    "can_follow_heavy" BOOLEAN NOT NULL DEFAULT false,
    "requires_transition_before" BOOLEAN NOT NULL DEFAULT false,
    "avoid_near_repetition" BOOLEAN NOT NULL DEFAULT true,
    "should_not_follow_tags" "CardTag"[] DEFAULT ARRAY[]::"CardTag"[],
    "should_not_precede_tags" "CardTag"[] DEFAULT ARRAY[]::"CardTag"[],
    "tags" "CardTag"[] DEFAULT ARRAY[]::"CardTag"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "mode" "SessionMode" NOT NULL,
    "length" "SessionLength" NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "max_intensity" "CardIntensity" NOT NULL,
    "videos_enabled" BOOLEAN NOT NULL DEFAULT true,
    "music_enabled" BOOLEAN NOT NULL DEFAULT true,
    "target_card_count" INTEGER NOT NULL,
    "current_position" INTEGER NOT NULL DEFAULT 0,
    "last_card_id" TEXT,
    "completed_card_count" INTEGER NOT NULL DEFAULT 0,
    "skips_used" INTEGER NOT NULL DEFAULT 0,
    "inversions_used" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "session_group_id" TEXT,
    "preferences_json" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_cards" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "SessionCardStatus" NOT NULL,
    "was_inverted" BOOLEAN NOT NULL DEFAULT false,
    "shown_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "skipped_at" TIMESTAMP(3),
    "metadata_json" TEXT,

    CONSTRAINT "session_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "session_id" TEXT,
    "feedback_type" "FeedbackType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_card_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "skip_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "last_feedback_type" "FeedbackType",
    "last_seen_at" TIMESTAMP(3),
    "last_skipped_at" TIMESTAMP(3),
    "never_again_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_card_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "video_category" "VideoCategory",
    "content_type" "VideoContentType",
    "visual_tags" TEXT[],
    "music_mood" "MusicMood",
    "processing_status" "MediaProcessingStatus" NOT NULL DEFAULT 'READY',
    "storage_key" TEXT NOT NULL,
    "hls_master_key" TEXT,
    "thumbnail_key" TEXT,
    "bucket" TEXT,
    "public_url" TEXT,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "duration_seconds" INTEGER,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "internal_label" TEXT,
    "original_filename" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_video_options" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "media_asset_id" TEXT NOT NULL,
    "draw_order" INTEGER NOT NULL,
    "was_selected" BOOLEAN NOT NULL DEFAULT false,
    "was_skipped" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_video_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" TEXT NOT NULL,
    "videos_enabled_default" BOOLEAN NOT NULL DEFAULT true,
    "music_enabled_default" BOOLEAN NOT NULL DEFAULT true,
    "max_intensity_default" "CardIntensity" NOT NULL DEFAULT 'PICO',
    "preferred_session_length" "SessionLength" NOT NULL DEFAULT 'MEDIA',
    "show_history" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "couple_participants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" "ParticipantRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couple_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_alignment_responses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "participant_role" "ParticipantRole" NOT NULL,
    "version" INTEGER NOT NULL,
    "questions_version" TEXT NOT NULL,
    "answers_json" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_alignment_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "decks_system_key_key" ON "decks"("system_key");

-- CreateIndex
CREATE UNIQUE INDEX "cards_system_key_key" ON "cards"("system_key");

-- CreateIndex
CREATE INDEX "cards_deck_id_position_idx" ON "cards"("deck_id", "position");

-- CreateIndex
CREATE INDEX "session_cards_session_id_position_idx" ON "session_cards"("session_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "user_card_preferences_user_id_card_id_key" ON "user_card_preferences"("user_id", "card_id");

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_cards" ADD CONSTRAINT "session_cards_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_cards" ADD CONSTRAINT "session_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_feedback" ADD CONSTRAINT "card_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_feedback" ADD CONSTRAINT "card_feedback_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_feedback" ADD CONSTRAINT "card_feedback_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_preferences" ADD CONSTRAINT "user_card_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_preferences" ADD CONSTRAINT "user_card_preferences_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_video_options" ADD CONSTRAINT "session_video_options_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_video_options" ADD CONSTRAINT "session_video_options_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_video_options" ADD CONSTRAINT "session_video_options_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couple_participants" ADD CONSTRAINT "couple_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_alignment_responses" ADD CONSTRAINT "private_alignment_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_alignment_responses" ADD CONSTRAINT "private_alignment_responses_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "couple_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
