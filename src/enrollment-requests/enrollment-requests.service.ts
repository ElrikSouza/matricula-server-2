import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EnrollmentRequest } from './enrollment-request.entity';

@Injectable()
export class EnrollmentRequestsService {
  constructor(
    @InjectRepository(EnrollmentRequest)
    private enrollmentRequestsRepo: Repository<EnrollmentRequest>,
    private entityManager: EntityManager,
  ) {}

  async getRequestedCoursesByStudentId(studentId: number) {
    const courses = await this.entityManager.query(
      `
      select co.name, co.code from course co inner join enrollment_request er
      on co.code = er.course_code where er.student_id = $1;
    `,
      [studentId],
    );

    return { courses };
  }

  async getRequestedCoursesCodesByStudentId(studentId: number) {
    return this.entityManager
      .query(
        `
        select array(select course_code from enrollment_request where student_id = $1) as "courseCodes"; 
    `,
        [studentId],
      )
      .then((it) => it[0]);
  }

  async deleteEnrollmentRequests(courseCodes: string[], studentId: number) {
    const codesOfDeletedRequests: Set<string> = await this.entityManager
      .query(
        `delete from enrollment_request where student_id = $1 and course_code in (${courseCodes.map(
          (_, i) => `$${i + 2}`,
        )})
      returning course_code as codes;
    `,
        [studentId, ...courseCodes],
      )
      .then(([it]) => new Set(it.map((codes) => codes.code)));

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
