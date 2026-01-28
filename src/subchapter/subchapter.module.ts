import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SubChapterController } from './subchapter.controller';
import { SubChapterService } from './subchapter.service';
import { IsAuthenticatedMiddleware } from 'src/middlewares';

@Module({
  controllers: [SubChapterController],
  providers: [SubChapterService],
})
export class SubChapterModule {}
