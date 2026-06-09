-- AlterTable
ALTER TABLE "unlock_groups" ADD COLUMN "hidden_from_ui" BOOLEAN NOT NULL DEFAULT false;

-- Set hidden_from_ui to true for DARK_THIRD_IMAGINATION
UPDATE "unlock_groups" SET "hidden_from_ui" = true WHERE "key" = 'DARK_THIRD_IMAGINATION';
