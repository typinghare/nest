import { Module } from '@nestjs/common';
import TaskController from './controller/task.controller';
import TaskService from './service/task.service';
import SubjectController from './controller/subject.controller';
import TaskTypeController from './controller/task-type.controller';
import TaskTypeService from './service/task-type.service';
import SubjectService from './service/subject.service';
import UserController from './controller/user.controller';
import UserService from './service/user.service';
import ResponseInterceptor from './interceptor/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [
    UserController,
    TaskController,
    TaskTypeController,
    SubjectController,
  ],
  providers: [
    UserService,
    TaskService,
    TaskTypeService,
    SubjectService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class SupervisorModule {
}