import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SubChapterController } from './subchapter.controller';
import { SubChapterService } from './subchapter.service';
import { IsAuthenticatedMiddleware } from 'src/middlewares';

@Module({
  controllers: [SubChapterController],
  providers: [SubChapterService],
})
export class SubChapterModule implements NestModule {
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes(
      {
        method: RequestMethod.GET,
        path: 'subchapters',
        version: '1',
      },
      {
        method: RequestMethod.GET,
        path: 'subchapters/:subchapterId',
      },
      {
        method: RequestMethod.POST,
        path: 'subchapters',
        version: '1',
      },
      {
        method: RequestMethod.PUT,
        path: 'subchapters/:subchapterId',
        version: '1',
      },
      {
        method: RequestMethod.DELETE,
        path: 'subchapters/:subchapterId',
        version: '1',
      },
    );
  }
}
