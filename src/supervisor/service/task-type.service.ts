import { Injectable } from '@nestjs/common';
import { getConnection, InsertResult } from 'typeorm';
import TaskTypeEntity from '../entity/task-type.entity';
import TaskTypeVo from '../vo/task-type.vo';
import TaskTypeDto from '../dto/task-type.dto';
import { RecordStatus } from '../common/status';

@Injectable()
export default class TaskTypeService {
  /**
   * Get task types by a specified subject.
   * @param subjectId
   */
  async getTaskTypes(subjectId: number): Promise<TaskTypeVo[]> {
    return await getConnection('supervisor')
      .getRepository(TaskTypeEntity)
      .createQueryBuilder('task_type')
      .leftJoinAndSelect('task_type.subject', 'subject')
      .select(['task_type.id', 'task_type.name'])
      .where('subject.id=:subjectId', { subjectId })
      .andWhere('task_type.status=:status', { status: RecordStatus.NORMAL })
      .getMany();
  }

  /**
   * Create a task type.
   * @param taskTypeDto
   */
  async createTaskType(taskTypeDto: TaskTypeDto): Promise<InsertResult> {
    return await getConnection('supervisor')
      .createQueryBuilder()
      .insert()
      .into(TaskTypeEntity)
      .values(taskTypeDto)
      .execute();
  }
}