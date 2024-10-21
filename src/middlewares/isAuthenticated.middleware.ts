import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async use(req: any, _res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';

      if (!token) {
        throw new UnauthorizedException();
      }

      req.user = await this.jwtService.verify(token);

      next();
    } catch (error: any) {
      throw new UnauthorizedException();
    }
  }
}
