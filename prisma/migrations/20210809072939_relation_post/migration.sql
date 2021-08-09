-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "relationUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY ("relationUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
