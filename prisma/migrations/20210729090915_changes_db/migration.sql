/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Garage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Garage_userId_unique" ON "Garage"("userId");
