-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "photos" DROP NOT NULL,
ALTER COLUMN "garage" DROP NOT NULL,
ALTER COLUMN "friends" DROP NOT NULL,
ALTER COLUMN "events" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
