import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genNumberedParams } from 'src/utils/gen-numbered-params';
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

  async createEnrollmentRequests(courseCodes: string[], studentId: number) {
    const coursesThatHaveMissingPrerequisites = await this.entityManager.query(
      `
      select pre.course_code, array_agg(pre.prerequisite_code) as prerequisites from
      course_prerequisite pre left join student_course_record rec
      on rec.student_id = $1 and pre.prerequisite_code = rec.course_code
      where pre.course_code in (${genNumberedParams(courseCodes.length, 1)}) 
      and student_id = NULL group by pre.course_code;
    `,
      [studentId, ...courseCodes],
    );

    const result = {
      acceptedRequests: [] as string[],
      blockedRequests: new Set<string>(),
      missingPrerequisites: new Set<string>(),
    };

    for (const course of coursesThatHaveMissingPrerequisites) {
      result.blockedRequests.add(course.course_code);
      course.prerequisites.forEach((code) =>
        result.missingPrerequisites.add(code),
      );
    }

    for (const code of courseCodes) {
      if (!result.blockedRequests.has(code)) {
        result.acceptedRequests.push(code);
      }
    }

    await this.entityManager.query(
      `
      insert into enrollment_request (student_id, course_code) values
      ${result.acceptedRequests.map((_, i) => `($1, $${i + 2})`)};
    `,
      [studentId, ...courseCodes],
    );

    return result;
  }

  async deleteEnrollmentRequests(courseCodes: string[], studentId: number) {
    const codesOfDeletedRequests: Set<string> = await this.entityManager
      .query(
        `delete from enrollment_request where student_id = $1 and course_code
        in (${genNumberedParams(courseCodes.length, 1)})
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
