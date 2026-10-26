import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export const ACCOUNT_DISABLED = 'ACCOUNT_DISABLED';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1] || '';

    let user: Awaited<ReturnType<UserService['findUserById']>>;

    try {
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const { userId } = await this.jwtService.verify(token);

      if (!userId) {
        throw new UnauthorizedException('Wrong token format - missing userId');
      }

      user = await this.userService.findUserById(userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // Hors du try/catch : sinon ces erreurs seraient converties en 401 "Invalid token"
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Le compte peut avoir été désactivé après l'émission du JWT
    if (!user.active) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        code: ACCOUNT_DISABLED,
        message: 'Ce compte a été désactivé.',
      });
    }

    request.user = user;

    return true;
  }
}
