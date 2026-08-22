import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from '../guards';
import {
  NOTIFICATION_SERVICE_TOKEN,
  NotificationServiceContract,
} from './contracts';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(IsAuthenticatedGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationServiceContract,
  ) {}

  @Get('/')
  async list(@Req() req: { user: { id: number } }, @Res() res: Response) {
    try {
      const [items, unreadCount] = await Promise.all([
        this.notificationService.listForUser(req.user.id),
        this.notificationService.countUnread(req.user.id),
      ]);
      return res.status(HttpStatus.OK).json({ items, unreadCount });
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/read')
  async markAllRead(
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      await this.notificationService.markAllRead(req.user.id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
