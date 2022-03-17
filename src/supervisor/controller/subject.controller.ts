import SubjectService from '../service/subject.service';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import SubjectDto from '../dto/subject.dto';
import SubjectVo from '../vo/subject.vo';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import BaseController, { ResponsePack } from './base.controller';

@ApiTags('supervisor')
@Controller('supervisor/subjects')
export default class SubjectController extends BaseController {
  constructor(
    private subjectService: SubjectService,
  ) {
    super();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully find all subjects.',
    type: [SubjectVo],
  })
  async findAll(): Promise<ResponsePack<SubjectVo[]>> {
    return this
      .message('Successfully find all subjects.')
      .data(await this.subjectService.findAll());
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Created subject successfully.',
    type: null,
  })
  @ApiBadRequestResponse({ description: 'Fail to create subject.' })
  async createSubject(@Body() subjectDto: SubjectDto): Promise<ResponsePack<null>> {
    try {
      await this.subjectService.createSubject(subjectDto);
      return this.message('Created subject successfully.').data();
    } catch (error) {
      throw new HttpException('Fail to create subject.', HttpStatus.BAD_REQUEST);
    }
  }
}