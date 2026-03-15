import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE_TOKEN } from './contracts';
import { IsAuthenticatedGuard } from '../guards';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [{ provide: AUTH_SERVICE_TOKEN, useClass: AuthService }, IsAuthenticatedGuard],
})
export class AuthModule {}
