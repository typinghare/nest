import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TaskTypeEntity from './task-type.entity';
import OngoingTaskEntity from './ongoing-task.entity';

@Entity('task')
export default class TaskEntity {
  @PrimaryGeneratedColumn()
  @OneToMany(() => OngoingTaskEntity, ongoingTask => ongoingTask.taskId)
  id: number;

  @Column()
  userId: number;

  @Column()
  status: number;

  @Column()
  taskTypeId: number;

  @Column()
  startTime: Date;

  @Column()
  lastResumeTime: Date;

  @Column()
  endTime: Date;

  @Column()
  duration: number;

  @Column()
  comment: string;

  @Column({ type: 'datetime' })
  createTime: Date;

  @Column()
  deleteTime: Date;

  @ManyToOne(() => TaskTypeEntity, taskType => taskType.id)
  taskType: TaskTypeEntity;
}
