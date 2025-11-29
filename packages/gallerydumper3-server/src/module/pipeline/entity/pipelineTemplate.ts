import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PipelineTemplateDO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'timestamp' })
  createAt: Date;

  @Column({ nullable: false, type: 'timestamp' })
  updateAt: Date;

  @Column({ type: 'timestamp' })
  deleteAt?: Date;

  @Column()
  pipelineTemplateId: string;

  @Column()
  name: string;

  @Column()
  creator: string;

  @Column({ type: 'text' })
  content: string;
}
