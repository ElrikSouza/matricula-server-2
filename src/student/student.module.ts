import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';
import { StudentController } from './student.controller';

@Module({
  controllers: [StudentController],
  imports: [CoursesModule],
})
export class StudentModule {}
