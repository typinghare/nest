import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from './user.enity';
import TaskEntity from './task.entity';

@Entity('ongoing_task')
export default class OngoingTaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  taskId: number | null;

  @ManyToOne(() => UserEntity, user => user.id)
  user: UserEntity;

  @ManyToOne(() => TaskEntity, task => task.id)
  task: TaskEntity;
}