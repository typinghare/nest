import { Injectable } from '@nestjs/common';
import { getConnection, InsertResult } from 'typeorm';
import { TaskTypeEntity } from '../entity/task-type.entity';

@Injectable()
export class TaskTypeService {
  async createTaskType(taskTypeEntity: Partial<TaskTypeEntity>): Promise<InsertResult> {
    return await getConnection('supervisor')
      .createQueryBuilder()
      .insert()
      .into(TaskTypeEntity)
      .values(taskTypeEntity)
      .execute();
  }
}