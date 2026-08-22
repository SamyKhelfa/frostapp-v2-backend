import { Inject, Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationServiceContract } from './contracts';

const MAX_ITEMS = 50;

@Injectable()
export class NotificationService implements NotificationServiceContract {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  listForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: MAX_ITEMS,
      include: {
        actor: { select: { id: true, name: true, avatar: true } },
        conversation: { select: { id: true, name: true, type: true } },
      },
    });
  }

  countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  async markAllRead(userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async notify(input: {
    userId: number;
    type: NotificationType;
    actorId?: number;
    conversationId?: number;
  }): Promise<Notification | null> {
    if (input.actorId === input.userId) return null;

    return this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        actorId: input.actorId,
        conversationId: input.conversationId,
      },
    });
  }

  async notifyMany(
    userIds: number[],
    input: {
      type: NotificationType;
      actorId?: number;
      conversationId?: number;
    },
  ): Promise<void> {
    const recipients = userIds.filter((id) => id !== input.actorId);

    if (recipients.length === 0) return;

    await this.prisma.notification.createMany({
      data: recipients.map((userId) => ({
        userId,
        type: input.type,
        actorId: input.actorId,
        conversationId: input.conversationId,
      })),
    });
  }
}
