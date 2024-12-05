import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = await this.extractTokenFromRequest(req);
    const payload = await this.authService.verifyToken(token);
    req['payload'] = payload;
    return true;
  }

  async extractTokenFromRequest(req: Request): Promise<string | null> {
    const [type, token] = req.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : null;
  }
}
