/*
  Warnings:

  - You are about to drop the column `chatId` on the `ChatAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `Mission` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `ChatAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ChatAnalysis` DROP FOREIGN KEY `ChatAnalysis_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `Mission` DROP FOREIGN KEY `Mission_chatId_fkey`;

-- DropIndex
DROP INDEX `ChatAnalysis_chatId_idx` ON `ChatAnalysis`;

-- DropIndex
DROP INDEX `Mission_chatId_idx` ON `Mission`;

-- AlterTable
ALTER TABLE `ChatAnalysis` DROP COLUMN `chatId`,
    ADD COLUMN `sessionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Mission` DROP COLUMN `chatId`,
    ADD COLUMN `sessionId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `ChatAnalysis_sessionId_idx` ON `ChatAnalysis`(`sessionId`);

-- CreateIndex
CREATE INDEX `Mission_sessionId_idx` ON `Mission`(`sessionId`);

-- AddForeignKey
ALTER TABLE `ChatAnalysis` ADD CONSTRAINT `ChatAnalysis_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ChatSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ChatSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
