import { Body, Controller, Post } from '@nestjs/common';
import { TaskTypeService } from '../service/task-type.service';
import { TaskTypeDto } from '../dto/task-type.dto';
import { SubjectService } from '../service/subject.service';

@Controller('supervisor/task-type')
export class TaskTypeController {
  constructor(
    private taskTypeService: TaskTypeService,
    private subjectService: SubjectService,
  ) {
  }

  @Post('/')
  async createTask(@Body() taskTypeDto: TaskTypeDto) {
    const subjectId = await this.subjectService.getId(taskTypeDto.name);
    if (subjectId === undefined) {
      throw new Error('No such subject.');
    }

    return this.taskTypeService.createTaskType({
      subjectId, name: taskTypeDto.name,
    });
  }
}