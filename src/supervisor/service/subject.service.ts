import { getConnection, InsertResult } from 'typeorm';
import SubjectEntity from '../entity/subject.entity';
import SubjectVo from '../vo/subject.vo';
import SubjectDto from '../dto/subject.dto';
import UserService from './user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class SubjectService {
  constructor(private userService: UserService) {
  }

  /**
   * Create a subject.
   * @param subjectDto
   */
  async createSubject(subjectDto: SubjectDto): Promise<InsertResult> {
    const userId = await this.userService.getUserId();
    return await getConnection('supervisor')
      .createQueryBuilder()
      .insert()
      .into(SubjectEntity)
      .values({ userId, ...subjectDto })
      .execute();
  }

  async getId(name: string): Promise<number | undefined> {
    const entity = await getConnection('supervisor')
      .getRepository(SubjectEntity)
      .createQueryBuilder()
      .where('name = :name', { name })
      .getOne();
    return entity && entity.id;
  }

  /**
   * Query all subjects of a specified user.
   */
  async findAll(): Promise<SubjectVo[]> {
    const userId = await this.userService.getUserId();

    return await getConnection('supervisor')
      .getRepository(SubjectEntity)
      .createQueryBuilder('subject')
      .select(['subject.id', 'subject.name'])
      .where('user_id = :userId', { userId })
      .orderBy({ 'subject.priority': 'DESC' })
      .getMany();
  }
}