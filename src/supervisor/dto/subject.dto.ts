import { ApiProperty } from '@nestjs/swagger';

export default class SubjectDto {
  @ApiProperty({
    description: '',
    maxLength: 32,
  })
  name: string;

  @ApiProperty({
    description: 'The priority of the subject. Subjects with higher priority display closer to the top of the list.',
    default: 0
  })
  priority?: number = 0;
}