import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskTypeEntity } from './task-type.entity';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  taskTypeId: number;

  @Column()
  startTime: Date;

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
