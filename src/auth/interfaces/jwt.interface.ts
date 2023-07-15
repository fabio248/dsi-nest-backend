import { UserRole } from '../../users/dto/enum/role.enum';

export interface JwtPayload {
  identify: string | number;
  sub: string | number;
  role: UserRole;
  tokenType: JwtTokenType;
  token_type: JwtTokenType;
  userEmail: string;
  user_id: string;
  iat: number;
  exp: number;
}

export type JwtTokenType = 'access_token' | 'refresh_token';
