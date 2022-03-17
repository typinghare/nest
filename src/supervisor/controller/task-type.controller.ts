import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import TaskTypeService from '../service/task-type.service';
import TaskTypeDto from '../dto/task-type.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import BaseController, { ResponsePack } from './base.controller';
import TaskTypeVo from '../vo/task-type.vo';

@ApiTags('supervisor')
@Controller('supervisor/task-types')
export default class TaskTypeController extends BaseController {
  constructor(
    private taskTypeService: TaskTypeService,
  ) {
    super();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully find all task types.',
    type: [TaskTypeVo],
  })
  async getTaskTypes(@Query('subjectId') subjectId: number): Promise<ResponsePack<TaskTypeVo[]>> {
    return this
      .message('Successfully find all task types.')
      .data(await this.taskTypeService.getTaskTypes(subjectId));
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The task type has been created successfully.',
    type: null,
  })
  @ApiBadRequestResponse({ description: 'Fail to create task type.' })
  async createTaskType(@Body() taskTypeDto: TaskTypeDto) {
    try {
      await this.taskTypeService.createTaskType(taskTypeDto);
      return this.message('The task type has been created successfully.').data();
    } catch (error) {
      throw new HttpException('Fail to create task type.', HttpStatus.BAD_REQUEST);
    }
  }
}