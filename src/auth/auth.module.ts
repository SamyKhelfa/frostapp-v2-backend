import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [AuthController],
  providers: [{ provide: AUTH_SERVICE_TOKEN, useClass: AuthService }],
})
export class AuthModule {}