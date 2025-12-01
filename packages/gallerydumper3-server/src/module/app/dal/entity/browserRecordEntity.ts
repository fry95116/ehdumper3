import { BaseEntity } from '@/common/baseEntity';

// @Entity()
export class BrowserRecordEntity extends BaseEntity {
  // @Index()
  // @Column({ type: 'varchar', length: 191 })
  browserRecordId: string;

  // @Index()
  // @Column({ type: 'varchar', length: 191 })
  galleryId: string;

  // @Index()
  // @Column({ type: 'varchar', length: 191 })
  userId: string;

  // @Column({ type: 'bigint', unsigned: true })
  pageView: number;
}
