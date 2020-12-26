import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { StudentVerificationCode } from './student-verification-code.entity';

@Injectable()
export class StudentVerificationCodeService {
  constructor(
    @InjectRepository(StudentVerificationCode)
    private verificationCodeRepo: Repository<StudentVerificationCode>,
  ) {}

  async validateVerificationCode(studentId: number, verificationCode: string) {
    const count = await this.verificationCodeRepo.count({
      where: {
        student_id: studentId,
        code: verificationCode,
        expiration_date: Raw((alias) => `${alias} <= NOW()`),
      },
    });

    if (count == 0) {
      throw new ForbiddenException('Wrong verification code.');
    }
  }
}
