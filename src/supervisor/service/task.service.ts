import { Injectable } from '@nestjs/common';
import { getConnection, InsertResult } from 'typeorm';
import { TaskEntity } from '../entity/task.entity';
import * as _ from 'lodash';
import { AnyMap } from '../interface';
import { getDay, RecordStatus } from '../util/database';

@Injectable()
export class TaskService {
  async findAll(date: Date): Promise<object[]> {
    const taskList: TaskEntity[] = await getConnection('supervisor')
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .where('task.status=:status', { status: RecordStatus.NORMAL })
      .andWhere('DATE_FORMAT(task.create_time, "%y-%m-%d") = :date', { date: getDay(date) })
      .orderBy('task.create_time', 'DESC')
      .leftJoinAndSelect('task.taskType', 'task_type')
      .leftJoinAndSelect('task_type.subject', 'subject')
      .getMany();

    return taskList.map(task => {
      const ret = <AnyMap>_.pick(task, ['id', 'startTime', 'endTime', 'duration', 'comment']);

      ret.taskName = task.taskType.name;
      ret.subjectName = task.taskType.subject.name;
      return ret;
    });
  }

  async createTask(taskEntity: Partial<TaskEntity> = {}): Promise<InsertResult> {
    return await getConnection('supervisor')
      .createQueryBuilder()
      .insert()
      .into(TaskEntity)
      .values(taskEntity)
      .execute();
  }

  async startTask(taskId: number): Promise<void> {
    await getConnection('supervisor')
      .createQueryBuilder()
      .update(TaskEntity)
      .set({ id: taskId, startTime: new Date() })
      .execute();
  }
}