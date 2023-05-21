import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthModuleConstants from '../utils/constants';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard(
  AuthModuleConstants.FirebaseAuthGuardString,
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
