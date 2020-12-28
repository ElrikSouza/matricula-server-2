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
      const dbResult = await this.entityManager.query(
        `select 
        c._id, c.course_name, array_remove(array_agg(cp.prerequisite_id), NULL) as prerequisites
        from course c left join course_prerequisite cp 
        on cp.course_id = c._id group by c._id;`,
      );

      await this.cacheManager.set('courses', dbResult, { ttl: 3000000 });

      return dbResult;
    }

    return cachedResult;
  }

  async getCompletedCoursesByStudendId(studentId: number) {
    const cachedResult = await this.cacheManager.get(`courses#${studentId}`);

    if (!cachedResult) {
      const { coursecodes: courseCodes } = await this.entityManager.query(`
        select
        array_agg(course.code) as courseCodes from course course
        inner join course_prerequisite course_p on course_p.course_id = course._id;
      `);

      await this.cacheManager.set(
        `courses#${studentId}`,
        { courseCodes },
        { ttl: 300000 },
      );

      return { courseCodes };
    }

    return cachedResult;
  }
}
