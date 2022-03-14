import { NestFactory } from '@nestjs/core';
import { createTypeOrmConnections } from './database';
import { Logger } from '@nestjs/common';
import { SupervisorModule } from './supervisor/supervisor.module';

async function bootstrap() {
  // TypeORM connections
  await createTypeOrmConnections();

  // create Nest App
  const supervisorApp = await NestFactory.create(SupervisorModule);
  supervisorApp.enableCors();

  // listen
  const listenPort = 3000;
  await supervisorApp.listen(listenPort);

  const logger = new Logger();
  logger.log(`NestJS is listening on ${listenPort} ...`, 'main');
}

bootstrap().then();
