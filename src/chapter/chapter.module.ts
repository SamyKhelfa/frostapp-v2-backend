import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { CHAPTER_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [ChapterController],
  providers: [
    IsAuthenticatedGuard,
    RolesGuard,
    { provide: CHAPTER_SERVICE_TOKEN, useClass: ChapterService },
  ],
})
export class ChapterModule {}
