import { IsEmail, Length } from 'class-validator';

export class LogInDto {
  @IsEmail()
  email: string;

  @Length(8, 70)
  password: string;
}
