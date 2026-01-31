import { MiddlewareConsumer, Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { SubChapterController } from './subchapter.controller';
import { SubChapterService } from './subchapter.service';

@Module({
  controllers: [SubChapterController],
  providers: [SubChapterService, IsAuthenticatedGuard, RolesGuard],
})
export class SubChapterModule {}
