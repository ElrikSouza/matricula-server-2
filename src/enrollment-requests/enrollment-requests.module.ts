import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentRequest } from './enrollment-request.entity';
import { EnrollmentRequestsController } from './enrollment-requests.controller';
import { EnrollmentRequestsService } from './enrollment-requests.service';

@Module({
  controllers: [EnrollmentRequestsController],
  providers: [EnrollmentRequestsService],
  imports: [TypeOrmModule.forFeature([EnrollmentRequest])],
})
export class EnrollmentRequestsModule {}
