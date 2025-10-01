import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class GalleryEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 191 })
  galleryId: string;

  @Index()
  @Column({ name: 'g_id', type: 'varchar', length: 191 })
  gId: string;

  @Column({ name: 'g_hash', type: 'varchar', length: 255, default: '' })
  gHash: string;

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Index()
  @Column({ type: 'varchar', length: 2048 })
  name: string;

  @Index()
  @Column({ name: 'name_jp', type: 'varchar', length: 2048, default: '' })
  nameJp: string;

  @Index()
  @Column({ type: 'varchar', length: 191 })
  type: string;

  @Column({ type: 'varchar', length: 512 })
  uploader: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  length: string;

  @Index()
  @Column({ type: 'varchar', length: 191 })
  language: string;
}
