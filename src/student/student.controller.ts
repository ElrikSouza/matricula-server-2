import { Controller, Get, UseGuards } from '@nestjs/common';
import { StudentId } from 'src/auth/jwt/student-id.decorator';
import { CoursesService } from 'src/courses/courses.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private coursesService: CoursesService) {}

  @Get(':id/completed-courses')
  async getCompletedCourses(@StudentId() studentId: number) {
    return this.coursesService.getCompletedCoursesByStudendId(studentId);
  }
}
