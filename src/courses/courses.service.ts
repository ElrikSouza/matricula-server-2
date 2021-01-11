import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheService } from 'src/cache/cache.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    private entityManager: EntityManager,
    private cacheManager: CacheService,
  ) {}

  async getCourses() {
    const cachedResult = await this.cacheManager.getObject('courses');

    if (!cachedResult) {
      const dbResult = await this.entityManager.query(`
        select co.code, co.name, 
        array_remove(array_agg(pre.prerequisite_code), NULL) as prerequisites
        from course co left join course_prerequisite pre
        on co.code = pre.course_code group by co.code;
      `);

      await this.cacheManager.setObject('courses', { courses: dbResult });

      return { courses: dbResult };
    }

    return cachedResult;
  }

  async getCompletedCoursesByStudendId(studentId: number) {
    const cachedResult = await this.cacheManager.getObject(
      `courses#${studentId}`,
    );

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

      await this.cacheManager.setObject(`courses#${studentId}`, dbResult);

      return dbResult;
    }

    return cachedResult;
  }
}
