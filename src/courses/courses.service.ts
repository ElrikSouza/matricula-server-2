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
        select co.code, co.name, 
        array_remove(array_agg(pre.prerequisite_code), NULL) as prerequisites
        from course co left join course_prerequisite pre
        on co.code = pre.course_code group by co.code;
      `);

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
        on co.code = scr.course_code
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
