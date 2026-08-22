import { Global, Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NOTIFICATION_SERVICE_TOKEN } from './contracts';

@Global()
@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    IsAuthenticatedGuard,
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  ],
  exports: [NotificationService, NOTIFICATION_SERVICE_TOKEN],
})
export class NotificationModule {}
