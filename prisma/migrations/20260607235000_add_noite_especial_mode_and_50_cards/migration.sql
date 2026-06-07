-- AlterEnum
-- This migration adds a new enum value to SessionMode
ALTER TYPE "SessionMode" ADD VALUE 'NOITE_ESPECIAL' AFTER 'TONS_ESCUROS';

-- Noite Especial does not require database changes beyond the enum
-- The 50 cards and new deck will be added via seed.ts
