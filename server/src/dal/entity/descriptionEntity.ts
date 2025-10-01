import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class DescriptionEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 191 })
  descriptionId: string;

  @Index()
  @Column({ type: 'varchar', length: 191 })
  galleryId: string;

  @Index()
  @Column({ type: 'varchar', length: 191 })
  type: string;

  @Column({ type: 'longtext' })
  value: string;
}
