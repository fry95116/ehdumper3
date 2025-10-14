// CREATE TABLE IF NOT EXISTS `gallery_dos` (
//   `id` varchar(191) NOT NULL,
//   `created_at` datetime(3) DEFAULT NULL,
//   `updated_at` datetime(3) DEFAULT NULL,
//   `deleted_at` datetime(3) DEFAULT NULL,
//   `g_id` varchar(191) NOT NULL,
//   `g_hash` varchar(255) DEFAULT NULL,
//   `url` varchar(2048) NOT NULL,
//   `name` varchar(2048) NOT NULL,
//   `name_jp` varchar(2048) NOT NULL DEFAULT '',
//   `type` varchar(191) NOT NULL,
//   `uploader` longtext NOT NULL,
//   `rating` float NOT NULL DEFAULT 0,
//   `length` bigint(20) unsigned NOT NULL DEFAULT 0,
//   `language` varchar(191) NOT NULL,
//   PRIMARY KEY (`id`) USING BTREE,
//   KEY `idx_gallery_dos_deleted_at` (`deleted_at`) USING BTREE,
//   KEY `idx_gallery_dos_g_id` (`g_id`) USING BTREE,
//   KEY `idx_gallery_dos_name` (`name`(768)) USING BTREE,
//   KEY `idx_gallery_dos_name_jp` (`name_jp`(768)) USING BTREE,
//   KEY `idx_gallery_dos_type` (`type`) USING BTREE,
//   KEY `idx_gallery_dos_language` (`language`) USING BTREE
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Index()
  @CreateDateColumn({ type: 'datetime', precision: 3, nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 3, nullable: true })
  updatedAt: Date;

  @Index()
  @Column({ type: 'datetime', precision: 3, nullable: true })
  deletedAt: Date;
}
