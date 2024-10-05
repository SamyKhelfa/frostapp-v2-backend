import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module'
import { JwtConfigModule } from './jwt/jwt.module';
import { LessonModule } from './lesson/lesson.module';
import { ChapterModule } from './chapter/chapter.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtConfigModule,
    PrismaModule, 
    AuthModule,
    LessonModule,
    ChapterModule
  ],
})
export class AppModule {}
