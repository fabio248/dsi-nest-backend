import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import { SignInInput } from './dto/input/sign-in.input';
import { SignInResponse } from './dto/reponse/sing-in.response';
import { UserResponse } from '../users/dto/response/user.response';
import { JwtPayload, JwtTokenType } from './interfaces/jwt.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async singIn(signInInput: SignInInput): Promise<SignInResponse> {
    this.logger.log('Sign In');
    const { email, password } = signInInput;

    const user = await this.userService.verifyCredentials(email, password);

    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  signToken(
    user: UserResponse,
    typeToken: JwtTokenType,
    expiredToken: Date,
  ): string {
    this.logger.log('Sign Token');

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      tokenType: typeToken,
      userEmail: user.email,
      iat: Date.now(),
      exp: expiredToken.getTime(),
    };

    const token = Jwt.sign(payload, this.configService.get('jwt.secret'));

    return token;
  }

  createAccessToken(user: UserResponse): string {
    this.logger.log('Create access token');

    const expiredToken = new Date();

    expiredToken.setHours(
      expiredToken.getHours() +
        this.configService.get<number>('jwt.access.expire'),
    );

    const token = this.signToken(user, 'access_token', expiredToken);

    return token;
  }

  createRefreshToken(user: UserResponse): string {
    this.logger.log('Create refresh token');

    const expiredToken = new Date();
    expiredToken.setHours(
      expiredToken.getHours() +
        this.configService.get<number>('jwt.refresh.expire'),
    );

    const token = this.signToken(user, 'refresh_token', expiredToken);

    return token;
  }
}
