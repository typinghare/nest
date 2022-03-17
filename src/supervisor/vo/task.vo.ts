import { ApiProperty } from '@nestjs/swagger';

export default class TaskVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  lastResumeTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  createTime: Date;

  @ApiProperty()
  taskTypeName: string;

  @ApiProperty()
  expectedDuration: number;

  @ApiProperty()
  taskTypeIntro: string;

  @ApiProperty()
  subjectName: string;
}