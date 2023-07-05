import { Body, Controller, Post } from '@nestjs/common';
import { SignInInput } from './dto/input/sign-in.input';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/input';
import { RefreshTokenInput } from './dto/input/refresh-token.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInInput: SignInInput) {
    return this.authService.singIn(signInInput);
  }

  @Post('login-google')
  signInGoogle(@Body() createUserDto: CreateUserDto) {
    return this.authService.signInGoogle(createUserDto);
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshTokenInput: RefreshTokenInput) {
    return this.authService.refreshToken(refreshTokenInput);
  }
}
