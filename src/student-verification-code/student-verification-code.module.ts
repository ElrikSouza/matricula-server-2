import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentVerificationCode } from './student-verification-code.entity';
import { StudentVerificationCodeService } from './student-verification-code.service';

@Module({
  providers: [StudentVerificationCodeService],
  imports: [TypeOrmModule.forFeature([StudentVerificationCode])],
  exports: [StudentVerificationCodeService],
})
export class StudentVerificationCodeModule {}
