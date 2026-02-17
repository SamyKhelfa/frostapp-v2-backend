import { MiddlewareConsumer, Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { SubChapterController } from './subchapter.controller';
import { SubChapterService } from './subchapter.service';
import { SUBCHAPTER_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [SubChapterController],
  providers: [
    SubChapterService,
    IsAuthenticatedGuard,
    RolesGuard,
    { provide: SUBCHAPTER_SERVICE_TOKEN, useClass: SubChapterService },
  ],
})
export class SubChapterModule {}
