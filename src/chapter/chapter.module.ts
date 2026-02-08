import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { CHAPTER_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [ChapterController],
  providers: [
    { provide: CHAPTER_SERVICE_TOKEN, useClass: ChapterService },
    IsAuthenticatedGuard,
    RolesGuard,
  ],
})
export class ChapterModule {}
