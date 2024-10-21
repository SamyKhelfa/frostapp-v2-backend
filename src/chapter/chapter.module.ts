import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { IsAuthenticatedMiddleware } from 'src/middlewares';

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule implements NestModule {
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes(
      {
        method: RequestMethod.GET,
        path: 'chapters',
        version: '1',
      },
      {
        method: RequestMethod.GET,
        path: 'chapters/:chapterId',
      },
      {
        method: RequestMethod.PUT,
        path: 'chapters/:chapterId',
        version: '1',
      },
      {
        method: RequestMethod.DELETE,
        path: 'chapters/:chapterId',
        version: '1',
      },
    );
  }
}
