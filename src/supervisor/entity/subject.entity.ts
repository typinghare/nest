import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskTypeEntity } from './task-type.entity';

@Entity('subject')
export class SubjectEntity {
  @PrimaryGeneratedColumn()
  @OneToMany(() => TaskTypeEntity, taskType => taskType.subjectId)
  id: number;

  @Column()
  name: string;

  @Column()
  priority: number;
}