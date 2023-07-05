import { RefreshTokenInput } from './dto/input/refresh-token.input';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import * as Jwt from 'jsonwebtoken';
import { SignInInput } from './dto/input/sign-in.input';
import { SignInResponse } from './dto/reponse/sing-in.response';
import { UserResponseDto } from '../users/dto/response/user.response';
import { JwtPayload, JwtTokenType } from './interfaces/jwt.interface';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/input';
import { InvalidTokenException } from './exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = this.configService.get('jwt.secret');

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

  async signInGoogle(createUserDto: CreateUserDto): Promise<SignInResponse> {
    this.logger.log('Sign in with google');

    const { email } = createUserDto;

    let user = await this.userService.findOneByEmailGoogle(email);

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
      sub: user.id,
      role: user.role,
      tokenType: typeToken,
      userEmail: user.email,
      iat: Date.now(),
      exp: expiredToken.getTime(),
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
}
