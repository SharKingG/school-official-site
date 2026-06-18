-- CreateTable
CREATE TABLE `admission_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `target` VARCHAR(200) NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `contact` VARCHAR(200) NULL,
    `attachment` VARCHAR(500) NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `admission_plans_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admission_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` INTEGER NOT NULL,
    `studentName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(20) NULL,
    `idCard` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `school` VARCHAR(200) NULL,
    `grade` VARCHAR(100) NULL,
    `score` VARCHAR(100) NULL,
    `remark` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SUBMITTED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `admission_records_planId_idx`(`planId`),
    INDEX `admission_records_studentName_idx`(`studentName`),
    INDEX `admission_records_idCard_idx`(`idCard`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recruitment_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `department` VARCHAR(200) NULL,
    `positionCount` INTEGER NOT NULL DEFAULT 1,
    `description` LONGTEXT NULL,
    `requirements` LONGTEXT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `contact` VARCHAR(200) NULL,
    `attachment` VARCHAR(500) NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `recruitment_plans_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recruitment_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` INTEGER NOT NULL,
    `applicantName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(20) NULL,
    `phone` VARCHAR(50) NOT NULL,
    `email` VARCHAR(200) NULL,
    `education` VARCHAR(100) NULL,
    `major` VARCHAR(200) NULL,
    `attachmentUrl` VARCHAR(500) NULL,
    `remark` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SUBMITTED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `recruitment_records_planId_idx`(`planId`),
    INDEX `recruitment_records_applicantName_idx`(`applicantName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `query_projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `queryFields` VARCHAR(200) NOT NULL DEFAULT 'name,idCard',
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `query_projects_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `query_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `idCard` VARCHAR(50) NULL,
    `ticketNo` VARCHAR(100) NULL,
    `resultTitle` VARCHAR(191) NOT NULL,
    `resultContent` LONGTEXT NULL,
    `fileUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `query_records_projectId_idx`(`projectId`),
    INDEX `query_records_name_idx`(`name`),
    INDEX `query_records_idCard_idx`(`idCard`),
    INDEX `query_records_ticketNo_idx`(`ticketNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admission_records` ADD CONSTRAINT `admission_records_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `admission_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recruitment_records` ADD CONSTRAINT `recruitment_records_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `recruitment_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `query_records` ADD CONSTRAINT `query_records_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `query_projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
