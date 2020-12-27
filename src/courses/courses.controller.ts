import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CoursesService } from './courses.service';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  async getCourses() {
    return this.coursesService.getCourses();
  }
}
