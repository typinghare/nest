import { getConnection, InsertResult } from 'typeorm';
import { SubjectEntity } from '../entity/subject.entity';

export class SubjectService {
  async createSubject(subjectEntity: Partial<SubjectEntity>): Promise<InsertResult> {
    return await getConnection('supervisor')
      .createQueryBuilder()
      .insert()
      .into(SubjectEntity)
      .values(subjectEntity)
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

  async findAll(): Promise<string[]> {
    const subjectList = await getConnection('supervisor')
      .getRepository(SubjectEntity)
      .createQueryBuilder('subject')
      .orderBy({
        'subject.priority': 'DESC',
        'subject.id': 'DESC',
      })
      .getMany();
    return subjectList.map(subject => subject.name);
  }
}