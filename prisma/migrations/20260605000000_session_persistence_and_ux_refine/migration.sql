-- Create the new enum type
CREATE TYPE "FeedbackType_new" AS ENUM ('FAVORITE', 'NEUTRAL', 'NEVER_AGAIN');

ALTER TABLE "card_feedback" ALTER COLUMN "feedback_type" TYPE "FeedbackType_new" 
USING CASE 
  WHEN "feedback_type"::text IN ('REPEAT', 'LATER') THEN 'NEUTRAL'::"FeedbackType_new"
  ELSE "feedback_type"::text::"FeedbackType_new"
END;

ALTER TABLE "user_card_preferences" ALTER COLUMN "last_feedback_type" TYPE "FeedbackType_new" 
USING CASE 
  WHEN "last_feedback_type"::text IN ('REPEAT', 'LATER') THEN 'NEUTRAL'::"FeedbackType_new"
  ELSE "last_feedback_type"::text::"FeedbackType_new"
END;

-- Drop old enum and rename new enum
DROP TYPE "FeedbackType";
ALTER TYPE "FeedbackType_new" RENAME TO "FeedbackType";
