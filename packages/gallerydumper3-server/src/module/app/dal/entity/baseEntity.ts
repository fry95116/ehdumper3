import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
