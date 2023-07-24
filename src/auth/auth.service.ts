import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/response/user.response';
import { JwtPayload, JwtTokenType } from './interfaces/jwt.interface';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from '../users/dto/input';
import { InvalidTokenException } from './exception';
import { MailerService } from '../mailer/mailer.service';
import { getRecoveryMail, getChangedPasswordMail } from './utils/mails';
import {
  ChangePasswordInput,
  RecoveryMailInput,
  SignInInput,
  RefreshTokenInput,
} from './dto/input';
import { ChangedPasswordResponseDto, SignInResponseDto } from './dto/reponse';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = this.configService.get('jwt.secret');
  private secret = this.configService.get<string>('jwt.secret');
  private urlRecoveryFront = this.configService.get<string>('url.recovery');

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async singIn(signInInput: SignInInput): Promise<SignInResponseDto> {
    this.logger.log('Sign In');
    const { email, password } = signInInput;

    const user = await this.userService.verifyCredentials(email, password);

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async signInGoogle(
    createUserDto: CreateUserInput,
  ): Promise<SignInResponseDto> {
    this.logger.log('Sign in with google');

    const { email } = createUserDto;

    let user = plainToInstance(
      UserResponseDto,
      await this.userService.findOneWithSensitiveInfo({ email }),
    );

    if (!user) {
      user = await this.userService.create(createUserDto);
    }

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  signToken(
    user: UserResponseDto,
    typeToken: JwtTokenType,
    expiredToken: Date,
  ): string {
    this.logger.log('Sign Token');

    const payload: JwtPayload = {
      identify: user.id,
      role: user.role,
      token_type: typeToken,
      user_id: user.email,
      iat: Date.now(),
      exp: expiredToken.getTime(),
      sub: user.id,
      tokenType: typeToken,
      userEmail: user.email,
    };

    const token = Jwt.sign(payload, this.jwtSecret);

    return token;
  }

  createAccessToken(user: UserResponseDto): string {
    this.logger.log('Create access token');

    const expiredToken = new Date();

    expiredToken.setHours(
      expiredToken.getHours() +
        this.configService.get<number>('jwt.access.expire'),
    );

    const token = this.signToken(user, 'access_token', expiredToken);

    return token;
  }

  createRefreshToken(user: UserResponseDto): string {
    this.logger.log('Create refresh token');

    const expiredToken = new Date();
    expiredToken.setHours(
      expiredToken.getHours() +
        this.configService.get<number>('jwt.refresh.expire'),
    );

    const token = this.signToken(user, 'refresh_token', expiredToken);

    return token;
  }

  async refreshToken(
    refreshTokenInput: RefreshTokenInput,
  ): Promise<{ accessToken: string }> {
    this.logger.log('Refresh token');
    try {
      const { token } = refreshTokenInput;
      const payload = Jwt.verify(token, this.jwtSecret) as JwtPayload;

      if (payload.tokenType !== 'refresh_token') {
        throw new InvalidTokenException();
      }

      const user = await this.userService.findOneByEmail(payload.userEmail);

      const accessToken = this.createAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async sendRecoveryEmail(recoveryMailInput: RecoveryMailInput) {
    const { email } = recoveryMailInput;

    const user = await this.userService.findOneByEmail(email);

    const recoveryToken = Jwt.sign({ sub: user.id }, this.secret as string, {
      expiresIn: '15min',
    });

    this.userService.update(user.id, { recoveryToken });

    const emailBody = getRecoveryMail(
      user.firstName,
      user.lastName,
      recoveryToken,
      this.urlRecoveryFront,
    );

    this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de contraseña',
      html: emailBody,
    });

    return { message: `Mail sent to ${email}` };
  }

  async sendChangedPasswordMail(
    userId: number,
  ): Promise<ChangedPasswordResponseDto> {
    const { email, firstName, lastName } = await this.userService.findOneById(
      userId,
    );

    const emailBody = getChangedPasswordMail(firstName, lastName);

    this.mailerService.sendMail({
      to: email,
      subject: 'Cambio de contraseña exitoso',
      html: emailBody,
    });

    const response = new ChangedPasswordResponseDto(email);

    return response;
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
  ): Promise<ChangedPasswordResponseDto> {
    try {
      const { newPassword, recoveryToken } = changePasswordInput;
      const { sub: userId } = Jwt.verify(recoveryToken, this.secret as string);

      const isValidToken = await this.userService.isValidRecoveryToken(
        +userId,
        recoveryToken,
      );

      if (!isValidToken) {
        throw new InvalidTokenException();
      }

      this.userService.update(+userId, {
        password: newPassword,
        recoveryToken: null,
      });

      return this.sendChangedPasswordMail(+userId);
    } catch (error) {
      throw new InvalidTokenException();
    }
  }
}
