ALTER TYPE "DeckType" ADD VALUE 'OFFICIAL';
ALTER TYPE "DeckType" ADD VALUE 'COUPLE_CUSTOM';

CREATE TABLE "unlock_groups" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unlock_groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "couple_unlocks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "unlock_group_key" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "enabled_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couple_unlocks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "deck_cards" (
    "id" TEXT NOT NULL,
    "deck_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deck_cards_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cards" ADD COLUMN "admin_only_editable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cards" ADD COLUMN "is_available_in_custom_selection" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cards" ADD COLUMN "is_available_in_default" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cards" ADD COLUMN "is_available_in_estreia" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cards" ADD COLUMN "is_official" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cards" ADD COLUMN "requires_couple_unlock" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cards" ADD COLUMN "unlock_group_key" TEXT;

ALTER TABLE "decks" ADD COLUMN "back_design" TEXT;
ALTER TABLE "decks" ADD COLUMN "cover_style" TEXT;
ALTER TABLE "decks" ADD COLUMN "created_by_admin_id" TEXT;
ALTER TABLE "decks" ADD COLUMN "description" TEXT;
ALTER TABLE "decks" ADD COLUMN "requires_couple_unlock" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "decks" ADD COLUMN "slug" TEXT;
ALTER TABLE "decks" ADD COLUMN "unlock_group_key" TEXT;

CREATE UNIQUE INDEX "unlock_groups_key_key" ON "unlock_groups"("key");
CREATE UNIQUE INDEX "couple_unlocks_user_id_unlock_group_key_key" ON "couple_unlocks"("user_id", "unlock_group_key");
CREATE INDEX "deck_cards_deck_id_position_idx" ON "deck_cards"("deck_id", "position");
CREATE UNIQUE INDEX "deck_cards_deck_id_card_id_key" ON "deck_cards"("deck_id", "card_id");
CREATE UNIQUE INDEX "decks_slug_key" ON "decks"("slug");

ALTER TABLE "decks" ADD CONSTRAINT "decks_unlock_group_key_fkey" FOREIGN KEY ("unlock_group_key") REFERENCES "unlock_groups"("key") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "cards" ADD CONSTRAINT "cards_unlock_group_key_fkey" FOREIGN KEY ("unlock_group_key") REFERENCES "unlock_groups"("key") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "couple_unlocks" ADD CONSTRAINT "couple_unlocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "couple_unlocks" ADD CONSTRAINT "couple_unlocks_unlock_group_key_fkey" FOREIGN KEY ("unlock_group_key") REFERENCES "unlock_groups"("key") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
