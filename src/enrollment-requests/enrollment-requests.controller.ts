import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { StudentId } from '../auth/jwt/student-id.decorator';
import { EnrollmentRequestBulkDto } from './enrollment-request-bulk.dto';
import { EnrollmentRequestsService } from './enrollment-requests.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class EnrollmentRequestsController {
  constructor(private enrollmentRequestsService: EnrollmentRequestsService) {}

  @Get('enrollment-requests')
  async getEnrollmentRequestsByStudentId(
    @StudentId() studentId: number,
    @Query('codesOnly') codesOnly: boolean,
  ) {
    if (codesOnly) {
      return this.enrollmentRequestsService.getRequestedCoursesCodesByStudentId(
        studentId,
      );
    } else {
      return this.enrollmentRequestsService.getRequestedCoursesByStudentId(
        studentId,
      );
    }
  }

  @Post('enrollment-requests:bulk')
  async createEnrollmentRequests(
    @Body() { courseCodes }: EnrollmentRequestBulkDto,
    @StudentId() studentId: number,
  ) {
    await this.enrollmentRequestsService.createEnrollmentRequests(
      courseCodes,
      studentId,
    );
  }

  @Delete('enrollment-requests:bulk')
  async deleteEnrollmentRequests(
    @Body() { courseCodes }: EnrollmentRequestBulkDto,
    @StudentId() studentId: number,
  ) {
    return this.enrollmentRequestsService.deleteEnrollmentRequests(
      courseCodes,
      studentId,
    );
  }
}
