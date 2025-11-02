-- DropForeignKey
ALTER TABLE `contribution` DROP FOREIGN KEY `Contribution_dizimistaId_fkey`;

-- DropIndex
DROP INDEX `Contribution_dizimistaId_fkey` ON `contribution`;

-- AlterTable
ALTER TABLE `contribution` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `massDate` DATETIME(3) NULL,
    ADD COLUMN `month` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `year` INTEGER NULL,
    MODIFY `dizimistaId` INTEGER NULL,
    MODIFY `amount` DECIMAL(10, 2) NOT NULL;

-- CreateTable
CREATE TABLE `ContributionDenomination` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contributionId` INTEGER NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contribution` ADD CONSTRAINT `Contribution_dizimistaId_fkey` FOREIGN KEY (`dizimistaId`) REFERENCES `Dizimista`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContributionDenomination` ADD CONSTRAINT `ContributionDenomination_contributionId_fkey` FOREIGN KEY (`contributionId`) REFERENCES `Contribution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
