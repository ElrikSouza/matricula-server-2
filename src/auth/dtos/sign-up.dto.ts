import { IsEmail, IsPositive, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @Length(8, 70)
  password: string;

  @IsPositive()
  studentId: number;

  @Length(6, 6)
  verificationCode: string;
}
