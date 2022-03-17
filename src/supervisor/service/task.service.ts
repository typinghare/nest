import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import TaskEntity from '../entity/task.entity';
import { getDay, getIdFromInsertResult, getMinuteDifference } from '../util/database';
import TaskDto from '../dto/task.dto';
import { TaskStatus } from '../common/status';
import { convertToVo, convertToVoArray } from '../util/conversion';
import TaskVo from '../vo/task.vo';
import { taskPrescription } from '../common/conversion-prescription';
import UserService from './user.service';
import { TaskAction } from '../common/enum';
import OngoingTaskEntity from '../entity/ongoing-task.entity';


@Injectable()
export default class TaskService {
  constructor(private userService: UserService) {
  }

  /**
   * Find a task by specified id.
   * @param id
   */
  async find(id: number): Promise<TaskEntity> {
    return await getConnection('supervisor')
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.taskType', 'taskType')
      .leftJoinAndSelect('taskType.subject', 'subject')
      .where('task.id = :id', { id })
      .andWhere('task.status >= :status', { status: TaskStatus.NORMAL })
      .getOne();
  }

  /**
   * Find all tasks.
   * @param userId
   * @param date
   */
  async findAll(date: Date, userId: number = undefined): Promise<TaskVo[]> {
    userId = userId || await this.userService.getUserId();
    const taskList: TaskEntity[] = await getConnection('supervisor')
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.taskType', 'task_type')
      .leftJoinAndSelect('task_type.subject', 'subject')
      .andWhere('task.userId=:userId', { userId })
      .where('task.status >= :status', { status: TaskStatus.NORMAL })
      .andWhere('DATE_FORMAT(task.create_time, "%y-%m-%d") = :date', { date: getDay(date) })
      .orderBy('task.create_time', 'DESC')
      .getMany();

    const taskVoArray = convertToVoArray<TaskVo>(taskList, taskPrescription);
    taskVoArray.map(task => {
      if (task.startTime && task.status === TaskStatus.ONGOING)
        task.duration += getMinuteDifference(new Date(), task.lastResumeTime);
    });

    return taskVoArray;
  }

  /**
   * User create a task.
   * @param taskDto
   */
  async createTask(taskDto: TaskDto): Promise<TaskVo> {
    const userId = await this.userService.getUserId();
    const insertResult = await getConnection('supervisor')
      .createQueryBuilder()
      .insert()
      .into(TaskEntity)
      .values([{
        userId: userId,
        taskTypeId: taskDto.taskTypeId,
        comment: taskDto.comment,
        createTime: new Date(),
      }])
      .execute();

    if (!insertResult) throw new Error('Insert result is missing.');

    const taskId = getIdFromInsertResult(insertResult);
    if (taskDto.start) await this.startTask(taskId);

    await this.setOngoingTask(taskId);

    return convertToVo<TaskVo>(await this.find(taskId), taskPrescription);
  }

  /**
   * Set a specified class as an ongoing task.
   * @param taskId
   */
  async setOngoingTask(taskId): Promise<void> {
    const userId = await this.userService.getUserId();
    await getConnection('supervisor')
      .createQueryBuilder()
      .update(OngoingTaskEntity)
      .where('user_id = :userId', { userId })
      .set({ taskId })
      .execute();
  }

  /**
   * Update the status of the ongoing task.
   * @param action
   */
  async updateOngoingTaskStatus(action: TaskAction): Promise<TaskVo> {
    const ongoingTask = await this.userService.getOngoingTask();
    if (!ongoingTask) throw new Error('No ongoing task.');
    if ([TaskStatus.DELETED, TaskStatus.HAS_ENDED].includes(ongoingTask.status)) {
      throw new Error('Task has ended.');
    }

    switch (action) {
      case TaskAction.START:
        return await this.startTask(ongoingTask.id);
      case TaskAction.PAUSE:
        return await this.pauseTask(ongoingTask.id);
      case TaskAction.RESUME:
        return this.resumeTask(ongoingTask.id);
      case TaskAction.END:
        return this.endTask(ongoingTask.id);
      case TaskAction.REMOVE:
        return this.removeTask(ongoingTask.id);
      default:
        return;
    }
  }

  /**
   * Start a task.
   * @param id
   */
  async startTask(id: number): Promise<TaskVo> {
    const updateResult = await getConnection('supervisor')
      .createQueryBuilder()
      .update(TaskEntity)
      .where('id=:id', { id })
      .set({
        status: TaskStatus.ONGOING,
        startTime: new Date(),
        lastResumeTime: new Date(),
      })
      .execute();

    if (!updateResult) throw new Error('Fail to start the task.');
    return convertToVo<TaskVo>(await this.find(id), taskPrescription);
  }

  /**
   * Pause a task.
   * @param id
   */
  async pauseTask(id: number): Promise<TaskVo> {
    const task = await this.find(id);
    if (!task) throw new Error('Task not found.');

    const durationPlus = Math.floor((new Date().getTime() - task.lastResumeTime.getTime()) / 60000);
    const duration = task.duration + durationPlus;

    const updateResult = await getConnection('supervisor')
      .createQueryBuilder()
      .update(TaskEntity)
      .where('id=:id', { id })
      .set({ status: TaskStatus.PAUSING, duration })
      .execute();

    if (!updateResult) throw new Error('Fail to pause the task.');
    return convertToVo<TaskVo>(await this.find(id), taskPrescription);
  }

  /**
   * Resume a task.
   * @param id
   */
  async resumeTask(id: number): Promise<TaskVo> {
    const updateResult = await getConnection('supervisor')
      .createQueryBuilder()
      .update(TaskEntity)
      .where('id=:id', { id })
      .set({
        status: TaskStatus.ONGOING,
        lastResumeTime: new Date(),
      })
      .execute();

    if (!updateResult) throw new Error('Fail to resume the task.');
    return convertToVo<TaskVo>(await this.find(id), taskPrescription);
  }

  /**
   * End a task.
   * @param id
   */
  async endTask(id: number): Promise<null> {
    const task = await this.find(id);
    if (!task) throw new Error('Task not found.');

    const durationPlus = Math.floor((new Date().getTime() - task.lastResumeTime.getTime()) / 60000);
    const duration = task.duration + durationPlus;

    const updateResult = await getConnection('supervisor')
      .createQueryBuilder()
      .update(TaskEntity)
      .where('id=:id', { id })
      .set({ status: TaskStatus.HAS_ENDED, endTime: new Date(), duration })
      .execute();

    if (!updateResult) throw new Error('Fail to end the task.');
    await this.unbindOngoingTask(id);
    return null;
  }

  /**
   * Remove a task.
   * @param id
   */
  async removeTask(id: number): Promise<null> {
    const updateResult = await getConnection('supervisor')
      .createQueryBuilder()
      .update(TaskEntity)
      .where('id=:id', { id })
      .set({ status: TaskStatus.DELETED })
      .execute();

    if (!updateResult) throw new Error('Fail to remove the task.');
    await this.unbindOngoingTask(id);
    return null;
  }

  async unbindOngoingTask(id: number): Promise<void> {
    const updateResult = await getConnection('supervisor')
      .createQueryBuilder()
      .update(OngoingTaskEntity)
      .where('taskId=:id', { id })
      .set({ taskId: null })
      .execute();

    if (!updateResult) throw new Error('Fail to unbind the ongoing task.');
  }
}