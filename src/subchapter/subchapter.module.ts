import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SubChapterController } from './subchapter.controller';
import { SubChapterService } from './subchapter.service';

@Module({
  controllers: [SubChapterController],
  providers: [SubChapterService],
})
export class SubChapterModule {}
