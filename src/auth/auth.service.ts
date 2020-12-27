import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareDataToHash, createHash } from 'src/crypt';
import { StudentVerificationCodeService } from '../student-verification-code/student-verification-code.service';
import { UserAccountService } from '../user-account/user-account.service';
import { LogInDto } from './dtos/log-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userAccountService: UserAccountService,
    private verificationCodeService: StudentVerificationCodeService,
    private jwtService: JwtService,
  ) {}

  private async getUserAccountIfCredentialsMatch({
    email,
    password,
  }: Pick<LogInDto, 'email' | 'password'>) {
    const userAccount = await this.userAccountService.getUserAccountOrFail(
      email,
    );

    const doPasswordsMatch = await compareDataToHash(
      password,
      userAccount.password,
    );

    if (!doPasswordsMatch) {
      throw new UnauthorizedException('Wrong password.');
    }

    return userAccount;
  }

  async logIn(logInInfo: LogInDto) {
    const userAccount = await this.getUserAccountIfCredentialsMatch(logInInfo);

    const accessToken = await this.jwtService.signAsync({
      studentId: userAccount.student_id,
      userId: userAccount._id,
    });

    return { accessToken };
  }

  async signUp(signUpInfo: SignUpDto) {
    const isEmailAlreadyTaken = await this.userAccountService.isEmailAlreadyTaken(
      signUpInfo.email,
    );

    if (isEmailAlreadyTaken) {
      throw new ConflictException('Email already taken.');
    }

    await this.verificationCodeService.validateVerificationCode(
      signUpInfo.studentId,
      signUpInfo.verificationCode,
    );

    const hashedPassword = await createHash(signUpInfo.password);

    await this.userAccountService.addUserAccount({
      student_id: signUpInfo.studentId,
      email: signUpInfo.email,
      password: hashedPassword,
    });
  }
}
