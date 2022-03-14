import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { TaskDto } from '../dto/task.dto';
import * as moment from 'moment';

@Controller('supervisor/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {
  }

  @Get('/')
  async findAll(@Query('date') date: string | undefined) {
    const _date = date ? moment(date).toDate() : new Date();
    return await this.taskService.findAll(_date);
  }

  @Post('/')
  async createTask(@Body() taskDto: TaskDto): Promise<string> {
    await this.taskService.createTask({ ...taskDto, createTime: new Date() });
    return 'Created a task successfully.';
  }

  @Put('/start')
  async startTask(@Body('taskId') taskId: number): Promise<string> {
    await this.taskService.startTask(taskId);
    return 'Object task starts.';
  }

  @Put('/pause')
  async pauseTask(): Promise<string> {
    return 'Object task pauses.';
  }

  @Put('/end')
  async end(): Promise<string> {
    return 'Object task ends.';
  }
}
