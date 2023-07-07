import { UserRole } from '../../users/dto/enum/role.enum';

export interface JwtPayload {
  sub: string | number;
  role: UserRole;
  tokenType: JwtTokenType;
  userEmail: string;
  iat: number;
  exp: number;
}

export type JwtTokenType = 'access_token' | 'refresh_token';
