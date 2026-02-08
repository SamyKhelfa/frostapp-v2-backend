import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { SubChapterController } from './subchapter.controller';
import { SubChapterService } from './subchapter.service';
import { SUBCHAPTER_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [SubChapterController],
  providers: [
    { provide: SUBCHAPTER_SERVICE_TOKEN, useClass: SubChapterService },
    IsAuthenticatedGuard,
    RolesGuard,
  ],
})
export class SubChapterModule {}
