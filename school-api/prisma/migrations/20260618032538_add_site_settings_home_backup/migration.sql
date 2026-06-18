-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `settingKey` VARCHAR(100) NOT NULL,
    `label` VARCHAR(100) NOT NULL,
    `settingValue` LONGTEXT NULL,
    `valueType` VARCHAR(50) NOT NULL DEFAULT 'TEXT',
    `settingGroup` VARCHAR(50) NOT NULL DEFAULT 'BASIC',
    `sort` INTEGER NOT NULL DEFAULT 0,
    `remark` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_settings_settingKey_key`(`settingKey`),
    INDEX `site_settings_settingGroup_idx`(`settingGroup`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `home_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(50) NULL,
    `categorySlug` VARCHAR(100) NULL,
    `categoryId` INTEGER NULL,
    `articleLimit` INTEGER NOT NULL DEFAULT 5,
    `moreLink` VARCHAR(500) NULL,
    `layout` VARCHAR(50) NOT NULL DEFAULT 'CARD',
    `sort` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `home_sections_categorySlug_idx`(`categorySlug`),
    INDEX `home_sections_visible_idx`(`visible`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `backup_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `backupType` VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
    `scope` VARCHAR(100) NOT NULL DEFAULT 'CONFIG',
    `description` VARCHAR(1000) NULL,
    `fileUrl` VARCHAR(500) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    `createdBy` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `backup_records_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
