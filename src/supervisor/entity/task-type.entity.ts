import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import SubjectEntity from './subject.entity';

@Entity('task_type')
export default class TaskTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  subjectId: number;

  @Column()
  name: string;

  @Column()
  expectedDuration: number;

  @Column()
  intro: string;

  @ManyToOne(() => SubjectEntity, subject => subject.id)
  subject: SubjectEntity;
}
