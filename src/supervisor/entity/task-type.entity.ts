import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from './task.entity';
import { SubjectEntity } from './subject.entity';

@Entity('task_type')
export class TaskTypeEntity {
  @PrimaryGeneratedColumn()
  @OneToMany(() => TaskEntity, task => task.taskType)
  id: number;

  @Column()
  status: number;

  @Column()
  subjectId: number;

  @Column()
  name: string;

  @ManyToOne(() => SubjectEntity, subject => subject.id)
  subject: SubjectEntity;
}
