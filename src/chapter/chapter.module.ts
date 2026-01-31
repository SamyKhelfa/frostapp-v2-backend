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

@Module({
  controllers: [ChapterController],
  providers: [ChapterService, IsAuthenticatedGuard, RolesGuard],
})
export class ChapterModule {}
