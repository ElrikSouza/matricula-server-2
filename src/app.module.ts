import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StudentVerificationCodeModule } from './student-verification-code/student-verification-code.module';
import { UserAccountModule } from './user-account/user-account.module';
import * as Env from './env';

@Module({
  imports: [
    AuthModule,
    StudentVerificationCodeModule,
    UserAccountModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: Env.DB_CONN,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
