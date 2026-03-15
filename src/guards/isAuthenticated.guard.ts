import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

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
    console.log({ token });
    try {
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const { userId } = await this.jwtService.verify(token);

      if (!userId) {
        throw new UnauthorizedException('Wrong token format - missing userId');
      }

      request.user = await this.userService.findUserById(userId);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
