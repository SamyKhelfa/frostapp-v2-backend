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

      const user = await this.userService.findUserById(userId);

      request.user = await this.userService.findUserById(userId);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

const test = `
On a userId on en fait quoi ?
Reponse :

reflexion => on récupère tous les éléments associés à ce userId, comment ? 

[Nest] 30238  - 01/31/2026, 11:48:33 AM   ERROR [ExceptionHandler] Nest can't resolve dependencies of the IsAuthenticatedGuard (JwtService, ?). Please make sure that the argument UserService at index [1] is available in the LessonModule context.

Potential solutions:
- Is LessonModule a valid NestJS module?
- If UserService is a provider, is it part of the current LessonModule?
- If UserService is exported from a separate @Module, is that module imported within LessonModule?
  @Module({
    imports: [ /* the Module containing UserService */ ]
  })

Error: Nest can't resolve dependencies of the IsAuthenticatedGuard (JwtService, ?). Please make sure that the argument UserService at index [1] is available in the LessonModule context.

Potential solutions:
- Is LessonModule a valid NestJS module?
- If UserService is a provider, is it part of the current LessonModule?
- If UserService is exported from a separate @Module, is that module imported within LessonModule?
  @Module({
    imports: [ /* the Module containing UserService */ ]
  })

    at Injector.lookupComponentInParentModules (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/injector.js:254:19)
    at async Injector.resolveComponentInstance (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/injector.js:207:33)
    at async resolveParam (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/injector.js:128:38)
    at async Promise.all (index 1)
    at async Injector.resolveConstructorParams (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/injector.js:143:27)
    at async Injector.loadInstance (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/injector.js:70:13)
    at async Injector.loadInjectable (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/injector.js:93:9)
    at async /Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/instance-loader.js:80:13
    at async Promise.all (index 0)
    at async InstanceLoader.createInstancesOfInjectables (/Users/samy/Documents/frostapp-v2-backend/node_modules/@nestjs/core/injector/instance-loader.js:79:9)
samy@Samys-MacBook-Air frostapp-v2-backend % 

`;
