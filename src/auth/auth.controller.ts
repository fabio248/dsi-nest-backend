import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/input';
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
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInInput: SignInInput) {
    return this.authService.singIn(signInInput);
  }

  @Post('login-google')
  @HttpCode(HttpStatus.OK)
  signInGoogle(@Body() createUserDto: CreateUserInput) {
    return this.authService.signInGoogle(createUserDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenInput: RefreshTokenInput) {
    return this.authService.refreshToken(refreshTokenInput);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  sendRecoveryMail(@Body() recoveryMailInput: RecoveryMailInput) {
    return this.authService.sendRecoveryEmail(recoveryMailInput);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() changePasswordInput: ChangePasswordInput) {
    return this.authService.changePassword(changePasswordInput);
  }
}
