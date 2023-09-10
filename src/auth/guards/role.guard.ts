/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Request } from 'express';
import JwtAuthGuard from './jwt.guard';
import { JwtPayload } from '../interfaces/jwt.interface';

const RoleGuard = (...roles: string[]): Type<CanActivate> => {
  class RoleGuardMinxin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      const isPublic = await super.canActivate(context);

      if (isPublic) {
        return true;
      }

      const req = context.switchToHttp().getRequest<Request>();
      const user = req.user as JwtPayload;

      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMinxin);
};

export default RoleGuard;
