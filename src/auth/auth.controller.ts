import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dtos/log-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async logIn(@Body() logInInfo: LogInDto) {
    return this.authService.logIn(logInInfo);
  }

  @Post('signup')
  async signUp(@Body() signUpInfo: SignUpDto) {
    return this.authService.signUp(signUpInfo);
  }
}
