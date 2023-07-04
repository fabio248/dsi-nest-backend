import { Body, Controller, Post } from '@nestjs/common';
import { SignInInput } from './dto/input/sign-in.input';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInInput: SignInInput) {
    return this.authService.singIn(signInInput);
  }
}
