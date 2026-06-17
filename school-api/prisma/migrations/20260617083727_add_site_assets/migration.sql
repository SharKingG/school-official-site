-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(500) NULL,
    `imageUrl` VARCHAR(500) NOT NULL,
    `linkUrl` VARCHAR(500) NULL,
    `position` VARCHAR(191) NOT NULL DEFAULT 'HOME_TOP',
    `size` VARCHAR(100) NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `banners_position_idx`(`position`),
    INDEX `banners_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'QUICK_LINK',
    `type` VARCHAR(191) NOT NULL DEFAULT 'INTERNAL',
    `openTarget` VARCHAR(191) NOT NULL DEFAULT 'SELF',
    `icon` VARCHAR(50) NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `links_category_idx`(`category`),
    INDEX `links_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(500) NULL,
    `intro` TEXT NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leaders_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `upload_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalName` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(500) NOT NULL,
    `fileSize` INTEGER NOT NULL DEFAULT 0,
    `mimeType` VARCHAR(191) NULL,
    `module` VARCHAR(191) NOT NULL DEFAULT 'common',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `upload_files_module_idx`(`module`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
