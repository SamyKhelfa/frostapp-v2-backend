import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module'
import { JwtConfigModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtConfigModule,
    PrismaModule, 
    AuthModule
  ],
})
export class AppModule {}
