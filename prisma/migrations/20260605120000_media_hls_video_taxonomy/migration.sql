-- AlterEnum
ALTER TYPE "VideoCategory" ADD VALUE 'MF';

-- CreateEnum
CREATE TYPE "VideoContentType" AS ENUM ('ORAL_ONLY', 'PENETRATION_ONLY', 'COMPLETE');

-- CreateEnum
CREATE TYPE "MediaProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'ERROR', 'DISABLED');

-- AlterTable
ALTER TABLE "media_assets" 
  ADD COLUMN "content_type" "VideoContentType",
  ADD COLUMN "hls_master_key" TEXT,
  ADD COLUMN "processing_status" "MediaProcessingStatus" NOT NULL DEFAULT 'READY',
  ADD COLUMN "thumbnail_key" TEXT,
  ADD COLUMN "visual_tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
