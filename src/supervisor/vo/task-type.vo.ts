import { ApiProperty } from '@nestjs/swagger';

export default class TaskTypeVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}