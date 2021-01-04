import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EntityManager } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    private entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCourses() {
    const cachedResult = await this.cacheManager.get('courses');

    if (!cachedResult) {
      const dbResult = await this.entityManager.query(`
      select
         a_course.code, a_course.name,
        array_remove(array_agg(co.code), NULL) as prerequisites
      from course a_course left join (
        course_prerequisite co_p inner join course co on co_p.prerequisite_id = co._id
      ) on a_course._id = co_p.course_id group by a_course._id;`);

      await this.cacheManager.set(
        'courses',
        { courses: dbResult },
        { ttl: 3000000 },
      );

      return { courses: dbResult };
    }

    return cachedResult;
  }

  async getCompletedCoursesByStudendId(studentId: number) {
    const cachedResult = await this.cacheManager.get(`courses#${studentId}`);

    if (!cachedResult) {
      const [dbResult] = await this.entityManager.query(
        `
        select
        array_agg(co.code) as "courseCodes"
        from course co inner join student_course_record scr
        on co._id = scr.course_id 
        where scr.student_id = $1;
      `,
        [studentId],
      );

      await this.cacheManager.set(`courses#${studentId}`, dbResult, {
        ttl: 300000,
      });

      return dbResult;
    }

    return cachedResult;
  }
}
