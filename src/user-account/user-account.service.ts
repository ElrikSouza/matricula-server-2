import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccount)
    private userAccountService: Repository<UserAccount>,
  ) {}

  async addUserAccount(userAccount: Omit<UserAccount, '_id'>) {
    await this.userAccountService.insert(userAccount);
  }

  async getUserAccountOrFail(email: string) {
    const userAccount = await this.userAccountService.findOne({ email });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    return userAccount;
  }

  async isEmailAlreadyTaken(email: string) {
    const count = await this.userAccountService.count({ email });

    return count < 1;
  }
}
