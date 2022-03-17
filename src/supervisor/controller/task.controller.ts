import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Put } from '@nestjs/common';
import TaskService from '../service/task.service';
import TaskDto from '../dto/task.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import BaseController, { ResponsePack } from './base.controller';
import TaskVo from '../vo/task.vo';
import { TaskAction } from '../common/enum';

@ApiTags('supervisor')
@Controller('supervisor/tasks')
export default class TaskController extends BaseController {
  constructor(private taskService: TaskService) {
    super();
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: TaskVo,
  })
  @ApiBadRequestResponse({
    description: 'Fail to create the task.',
  })
  @ApiBody({ type: TaskDto })
  async createTask(@Body() taskDto: TaskDto): Promise<ResponsePack<TaskVo>> {
    try {
      return this.message('The task has been successfully created.')
        .data(await this.taskService.createTask(taskDto));
    } catch (error) {
      throw new HttpException('Fail to create the task.', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Update the status of the ongoing task.',
    type: TaskVo,
  })
  async updateOngoingTaskStatus(@Body('action') action: TaskAction): Promise<any> {
    return this.message('Status of the task has been updated successfully.')
      .data(await this.taskService.updateOngoingTaskStatus(action));
  }
}
