import { Module } from '@nestjs/common';
import { UserAccountModule } from '../user-account/user-account.module';
import { StudentVerificationCodeModule } from '../student-verification-code/student-verification-code.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as Env from '../env';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    StudentVerificationCodeModule,
    UserAccountModule,
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
