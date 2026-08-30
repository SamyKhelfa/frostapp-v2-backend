import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { ColdShowerController } from './cold-shower.controller';
import { ColdShowerService } from './cold-shower.service';
import { COLD_SHOWER_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [ColdShowerController],
  providers: [
    ColdShowerService,
    IsAuthenticatedGuard,
    { provide: COLD_SHOWER_SERVICE_TOKEN, useClass: ColdShowerService },
  ],
})
export class ColdShowerModule {}
