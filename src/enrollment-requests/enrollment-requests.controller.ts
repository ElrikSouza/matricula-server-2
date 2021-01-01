import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { StudentId } from '../auth/jwt/student-id.decorator';
import { EnrollmentRequestBulkDto } from './enrollment-request-bulk.dto';
import { EnrollmentRequestsService } from './enrollment-requests.service';

@Controller('enrollment-requests')
@UseGuards(JwtAuthGuard)
export class EnrollmentRequestsController {
  constructor(private enrollmentRequestsService: EnrollmentRequestsService) {}

  @Get()
  async getEnrollmentRequestsByStudentId(@StudentId() studentId: number) {
    return this.enrollmentRequestsService.getEnrollmentRequestsByStudentId(
      studentId,
    );
  }

  @Delete('//:bulk')
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
