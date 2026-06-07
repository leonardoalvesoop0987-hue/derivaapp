UPDATE "media_assets"
SET "classification_status" = CASE
  WHEN "type" = 'VIDEO' AND ("video_category" IS NULL OR "content_type" IS NULL) THEN 'PENDING_CLASSIFICATION'::"MediaClassificationStatus"
  ELSE 'CLASSIFIED'::"MediaClassificationStatus"
END;

UPDATE "media_assets"
SET
  "processing_status" = 'QUEUED'::"MediaProcessingStatus",
  "processing_error" = 'Recuperado automaticamente: estava PROCESSING sem heartbeat antes da fila robusta.',
  "processing_started_at" = NULL,
  "processing_heartbeat_at" = NULL,
  "processing_finished_at" = NULL,
  "processing_owner" = NULL,
  "updated_at" = NOW()
WHERE "type" = 'VIDEO'
  AND "processing_status" = 'PROCESSING'::"MediaProcessingStatus";

UPDATE "media_assets"
SET
  "processing_status" = 'QUEUED'::"MediaProcessingStatus",
  "processing_error" = NULL,
  "updated_at" = NOW()
WHERE "type" = 'VIDEO'
  AND "processing_status" = 'UPLOADED'::"MediaProcessingStatus";
