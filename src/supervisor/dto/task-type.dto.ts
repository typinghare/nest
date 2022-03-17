import { ApiProperty } from '@nestjs/swagger';

export default class TaskTypeDto {
  @ApiProperty({
    description: 'The identifier of the subject',
  })
  subjectId: number;

  @ApiProperty({
    description: 'The name of the task type',
  })
  name: string;

  @ApiProperty({
    description: 'The introduction of the task type.',
  })
  intro: string;
}