import { Notification, NotificationType } from '@prisma/client';

export const NOTIFICATION_SERVICE_TOKEN = 'NOTIFICATION_SERVICE';

export interface NotificationServiceContract {
  listForUser(userId: number): Promise<unknown[]>;
  countUnread(userId: number): Promise<number>;
  markAllRead(userId: number): Promise<void>;
  notify(input: {
    userId: number;
    type: NotificationType;
    actorId?: number;
    conversationId?: number;
  }): Promise<Notification | null>;
  notifyMany(
    userIds: number[],
    input: {
      type: NotificationType;
      actorId?: number;
      conversationId?: number;
    },
  ): Promise<void>;
}
