import { NestFactory } from '@nestjs/core';
import { SupervisorModule } from './supervisor.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

export async function supervisorBootstrap() {
  // create Nest App
  const supervisorApp = await NestFactory.create(SupervisorModule);
  supervisorApp.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Supervisor 2')
    .setDescription('Supervisor description.')
    .setVersion('2.0.0')
    .addTag('supervisor')
    .build();
  const document = SwaggerModule.createDocument(supervisorApp, config);
  SwaggerModule.setup('supervisor/swagger', supervisorApp, document);

  // listen
  const listenPort = 3000;
  await supervisorApp.listen(listenPort);

  const logger = new Logger();
  logger.log(`NestJS is listening on ${listenPort} ...`, 'supervisor');
}