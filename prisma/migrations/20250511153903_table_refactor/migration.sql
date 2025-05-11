/*
  Warnings:

  - You are about to drop the `ActionMission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoalMilestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoalProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ActionMission` DROP FOREIGN KEY `ActionMission_chatMessageId_fkey`;

-- DropForeignKey
ALTER TABLE `ActionMission` DROP FOREIGN KEY `ActionMission_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ContentTag` DROP FOREIGN KEY `ContentTag_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `ContentUsage` DROP FOREIGN KEY `ContentUsage_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `ContentUsage` DROP FOREIGN KEY `ContentUsage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `EmotionAnalysis` DROP FOREIGN KEY `EmotionAnalysis_userId_fkey`;

-- DropForeignKey
ALTER TABLE `EmotionLog` DROP FOREIGN KEY `EmotionLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Goal` DROP FOREIGN KEY `Goal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GoalMilestone` DROP FOREIGN KEY `GoalMilestone_goalId_fkey`;

-- DropForeignKey
ALTER TABLE `GoalProgress` DROP FOREIGN KEY `GoalProgress_goalId_fkey`;

-- DropForeignKey
ALTER TABLE `Journal` DROP FOREIGN KEY `Journal_emotionLogId_fkey`;

-- DropForeignKey
ALTER TABLE `Journal` DROP FOREIGN KEY `Journal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `JournalAttachment` DROP FOREIGN KEY `JournalAttachment_journalId_fkey`;

-- DropForeignKey
ALTER TABLE `UserInterest` DROP FOREIGN KEY `UserInterest_userId_fkey`;

-- DropTable
DROP TABLE `ActionMission`;

-- DropTable
DROP TABLE `Content`;

-- DropTable
DROP TABLE `ContentTag`;

-- DropTable
DROP TABLE `ContentUsage`;

-- DropTable
DROP TABLE `EmotionAnalysis`;

-- DropTable
DROP TABLE `EmotionLog`;

-- DropTable
DROP TABLE `Goal`;

-- DropTable
DROP TABLE `GoalMilestone`;

-- DropTable
DROP TABLE `GoalProgress`;

-- DropTable
DROP TABLE `Journal`;

-- DropTable
DROP TABLE `JournalAttachment`;

-- DropTable
DROP TABLE `UserInterest`;

-- CreateTable
CREATE TABLE `ChatAnalysis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `topic` JSON NOT NULL,
    `emotion` JSON NOT NULL,
    `distortions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatAnalysis_chatId_idx`(`chatId`),
    INDEX `ChatAnalysis_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `progress` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Mission_chatId_idx`(`chatId`),
    INDEX `Mission_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChatAnalysis` ADD CONSTRAINT `ChatAnalysis_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `ChatSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatAnalysis` ADD CONSTRAINT `ChatAnalysis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `ChatSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
