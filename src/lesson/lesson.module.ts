import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { LessonsController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonService, IsAuthenticatedGuard, RolesGuard],
})
export class LessonModule {}
