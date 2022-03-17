import { ApiProperty } from '@nestjs/swagger';

export default class SubjectVo {
  @ApiProperty({
    description: 'The identifier of subject.',
  })
  id: number;

  @ApiProperty({
    description: 'The name of subject.',
  })
  name: string;
}