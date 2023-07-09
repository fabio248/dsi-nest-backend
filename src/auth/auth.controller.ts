import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/input';
import {
  ChangePasswordInput,
  RecoveryMailInput,
  RefreshTokenInput,
  SignInInput,
} from './dto/input';
@ApiTags('Auth')
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

  @Post('forgot-password')
  sendRecoveryMail(@Body() recoveryMailInput: RecoveryMailInput) {
    return this.authService.sendRecoveryEmail(recoveryMailInput);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordInput: ChangePasswordInput) {
    return this.authService.changePassword(changePasswordInput);
  }
}
