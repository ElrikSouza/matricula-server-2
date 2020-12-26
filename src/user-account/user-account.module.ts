import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './user-account.entity';
import { UserAccountService } from './user-account.service';

@Module({
  providers: [UserAccountService],
  exports: [UserAccountService],
  imports: [TypeOrmModule.forFeature([UserAccount])],
})
export class UserAccountModule {}
