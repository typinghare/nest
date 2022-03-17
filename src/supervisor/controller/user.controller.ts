import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import UserService from '../service/user.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import BaseController, { ResponsePack } from './base.controller';
import TaskVo from '../vo/task.vo';
import * as moment from 'moment';
import TaskService from '../service/task.service';

@ApiTags('supervisor')
@Controller('supervisor/users')
export default class UserController extends BaseController {
  constructor(
    private userService: UserService,
    private taskService: TaskService,
  ) {
    super();
  }

  @Get('/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully find all tasks.',
    type: [TaskVo],
  })
  async findAllTask(
    @Query('date') date: string | undefined,
  ): Promise<ResponsePack<TaskVo[]>> {
    const _date: Date = date ? moment(date).toDate() : new Date();
    return this.message('Successfully find all tasks.')
      .data(await this.taskService.findAll(_date));
  }

  @Get('/:userId/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully find all tasks.',
    type: [TaskVo],
  })
  async findAllTaskByUser(
    @Param('userId') userId: number,
    @Query('date') date: string | undefined,
  ): Promise<ResponsePack<TaskVo[]>> {
    const _date: Date = date ? moment(date).toDate() : new Date();
    return this.message('Successfully find all tasks.')
      .data(await this.taskService.findAll(_date, userId));
  }

  @Get('/:userId/ongoing_task/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get ongoing task.',
    type: TaskVo,
  })
  async getOngoingTaskByUser(@Param('userId') userId: number): Promise<ResponsePack<TaskVo>> {
    return this
      .message('Successfully get ongoing task.')
      .data(await this.userService.getOngoingTask(userId));
  }

  @Get('/ongoing_task')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully get ongoing task.',
    type: TaskVo,
  })
  async getOngoingTask(): Promise<ResponsePack<TaskVo>> {
    return this
      .message('Successfully get ongoing task.')
      .data(await this.userService.getOngoingTask());
  }
}