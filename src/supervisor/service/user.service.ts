import { getConnection } from 'typeorm';
import TaskEntity from '../entity/task.entity';
import { Injectable } from '@nestjs/common';
import { convertToVo } from '../util/conversion';
import TaskVo from '../vo/task.vo';
import OngoingTaskEntity from '../entity/ongoing-task.entity';
import { TaskStatus } from '../common/status';
import { taskPrescription } from '../common/conversion-prescription';
import { getMinuteDifference } from '../util/database';

@Injectable()
export default class UserService {
  /**
   * Get the identifier of user.
   */
  async getUserId(): Promise<number> {
    return 1;
  }

  /**
   * Get user's ongoing task.
   * @param userId
   */
  async getOngoingTask(userId: number = null): Promise<TaskVo> {
    userId = userId || await this.getUserId();

    const hasNotEndedTask = await getConnection('supervisor')
      .getRepository(OngoingTaskEntity)
      .createQueryBuilder('ongoingTask')
      .leftJoinAndSelect('ongoingTask.task', 'task')
      .leftJoinAndSelect('task.taskType', 'taskType')
      .leftJoinAndSelect('taskType.subject', 'subject')
      .where('ongoingTask.userId=:userId', { userId })
      .andWhere('task.status IN (:...status)', {
        status: [TaskStatus.ONGOING, TaskStatus.PAUSING],
      })
      .getOne();

    if (!hasNotEndedTask || hasNotEndedTask.taskId === null)
      return await this.getUserId() === userId ? this.reachOngoingTask() : null;

    // duration
    const task = hasNotEndedTask.task;
    if (task.startTime && task.status === TaskStatus.ONGOING)
      task.duration += getMinuteDifference(new Date(), task.lastResumeTime);

    return convertToVo<TaskVo>(hasNotEndedTask.task, taskPrescription);
  }

  /**
   * Reach a recent task, and set it as the ongoing task.
   */
  async reachOngoingTask(): Promise<TaskVo> {
    const userId = await this.getUserId();

    const earliestNotEndTask = await getConnection('supervisor')
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.taskType', 'task_type')
      .leftJoinAndSelect('task_type.subject', 'subject')
      .where('task.status IN (:...status)', {
        status: [
          TaskStatus.NORMAL, TaskStatus.ONGOING, TaskStatus.PAUSING,
        ],
      })
      .orderBy('task.create_time', 'ASC')
      .getOne();

    if (!earliestNotEndTask) return null;

    await getConnection('supervisor')
      .createQueryBuilder()
      .update(OngoingTaskEntity)
      .where('id=:userId', { userId })
      .set({ taskId: earliestNotEndTask.id })
      .execute();

    return convertToVo<TaskVo>(earliestNotEndTask, taskPrescription);
  }
}