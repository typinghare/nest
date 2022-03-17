import { ApiProperty } from '@nestjs/swagger';

export default class TaskDto {
  @ApiProperty({
    description: 'The identifier of task type where the task belongs.',
  })
  taskTypeId: number;

  @ApiProperty({
    description: 'Comment of the task.',
  })
  comment: string;

  @ApiProperty({
    description: 'Whether to start the task immediately',
  })
  start?: boolean;
}