import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { LessonsController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { IsAuthenticatedMiddleware } from '../middlewares';

@Module({
  controllers: [LessonsController],
  providers: [LessonService],
})
export class LessonModule implements NestModule {
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes(
      {
        method: RequestMethod.GET,
        path: 'lessons',
        version: '1',
      },
      {
        method: RequestMethod.GET,
        path: 'lessons/:lessonId',
        version: '1',
      },
      {
        method: RequestMethod.PUT,
        path: 'lessons/:lessonId',
        version: '1',
      },
      {
        method: RequestMethod.DELETE,
        path: 'lessons/:lessonId',
        version: '1',
      },
    );
  }
}
