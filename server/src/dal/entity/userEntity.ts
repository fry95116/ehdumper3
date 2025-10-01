import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity()
export class UserEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 191 })
  userId: string;
}
