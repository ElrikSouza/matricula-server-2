import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EnrollmentRequest } from './enrollment-request.entity';

@Injectable()
export class EnrollmentRequestsService {
  constructor(
    @InjectRepository(EnrollmentRequestsService)
    private enrollmentRequestsRepo: Repository<EnrollmentRequest>,
    private entityManager: EntityManager,
  ) {}

  async getEnrollmentRequestsByStudentId(studentId: number) {
    return this.entityManager
      .query(
        `
        select array(
            select c.code from enrollment-request e
            inner join course c on e.course_id = c._id where e.student_id = $1
        ) "courseCodes"; 
    `,
        [studentId],
      )
      .then((it) => it[0]);
  }

  async deleteEnrollmentRequests(courseCodes: string[], studentId: number) {
    const codesOfDeletedRequests: Set<string> = await this.entityManager
      .query(
        `
      select array(delete from enrollment-request where student_id = $1, 
      code in (${courseCodes.map((_, i) => `${i + 2}`)})
      returning code) as codes;
    `,
        [studentId, ...courseCodes],
      )
      .then(([it]) => new Set(it));

    const result = {
      deletedRequests: [] as string[],
      rejectedDeletions: [] as string[],
    };

    for (const code of courseCodes) {
      if (code in codesOfDeletedRequests) {
        result.deletedRequests.push(code);
      } else {
        result.rejectedDeletions.push(code);
      }
    }

    return result;
  }
}
