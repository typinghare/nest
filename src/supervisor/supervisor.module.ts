import { Module } from '@nestjs/common';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { SubjectController } from './controller/subject.controller';
import { TaskTypeController } from './controller/task-type.controller';
import { TaskTypeService } from './service/task-type.service';
import { SubjectService } from './service/subject.service';

@Module({
  imports: [],
  controllers: [TaskController, TaskTypeController, SubjectController],
  providers: [TaskService, TaskTypeService, SubjectService],
})
export class SupervisorModule {
}