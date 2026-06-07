DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'MediaProcessingStatus'
      AND e.enumlabel = 'QUEUED'
  ) THEN
    ALTER TYPE "MediaProcessingStatus" ADD VALUE 'QUEUED' BEFORE 'UPLOADED';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MediaClassificationStatus') THEN
    CREATE TYPE "MediaClassificationStatus" AS ENUM ('PENDING_CLASSIFICATION', 'CLASSIFIED');
  END IF;
END $$;

ALTER TABLE "media_assets"
  ADD COLUMN IF NOT EXISTS "classification_status" "MediaClassificationStatus" NOT NULL DEFAULT 'CLASSIFIED',
  ADD COLUMN IF NOT EXISTS "processing_started_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "processing_heartbeat_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "processing_finished_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "processing_owner" TEXT;

CREATE INDEX IF NOT EXISTS "media_assets_type_processing_status_created_at_idx"
  ON "media_assets"("type", "processing_status", "created_at");

CREATE INDEX IF NOT EXISTS "media_assets_type_processing_status_classification_status_is_active_idx"
  ON "media_assets"("type", "processing_status", "classification_status", "is_active");

CREATE INDEX IF NOT EXISTS "media_assets_processing_owner_idx"
  ON "media_assets"("processing_owner");
