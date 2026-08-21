import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PROGRESS_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [ProgressController],
  providers: [
    ProgressService,
    IsAuthenticatedGuard,
    { provide: PROGRESS_SERVICE_TOKEN, useClass: ProgressService },
  ],
})
export class ProgressModule {}
