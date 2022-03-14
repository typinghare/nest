import { SubjectService } from '../service/subject.service';
import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SubjectDto } from '../dto/subject.dto';

@Controller('supervisor/subjects')
export class SubjectController {
  constructor(private subjectService: SubjectService) {
  }

  @Get('/')
  async findAll(): Promise<string[]> {
    return this.subjectService.findAll();
  }

  @Post('/')
  async createSubject(@Body() subjectDto: SubjectDto): Promise<any> {
    try {
      await this.subjectService.createSubject(subjectDto);
      return 'Created subject successfully.'
    } catch (error) {
      throw new HttpException('Fail to create subject.', HttpStatus.FORBIDDEN);
    }
  }
}