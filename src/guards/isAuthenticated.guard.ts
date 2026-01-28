import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1] || '';

    try {
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      request.user = await this.jwtService.verify(token);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
