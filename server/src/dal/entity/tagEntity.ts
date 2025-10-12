import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Index(['type', 'name', 'lowPower'])
@Index(['type', 'name'])
@Entity()
export class TagEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 191 })
  tagId: string;

  @Index()
  @Column({ type: 'varchar', length: 191 })
  galleryId: string;

  @Index()
  @Column({ type: 'varchar', length: 191 })
  type: string;

  @Index()
  @Column({ type: 'longtext' })
  name: string;

  @Index()
  @Column({ type: 'boolean', default: false })
  lowPower: boolean;
}
