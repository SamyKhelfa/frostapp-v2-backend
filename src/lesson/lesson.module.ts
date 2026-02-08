import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { LessonsController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LESSON_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [LessonsController],
  providers: [
    { provide: LESSON_SERVICE_TOKEN, useClass: LessonService },
    IsAuthenticatedGuard,
    RolesGuard,
  ],
})
export class LessonModule {}
