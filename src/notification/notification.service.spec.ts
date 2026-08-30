import { NotificationType } from '@prisma/client';
import { NotificationService } from './notification.service';

const ME = 1;
const OTHER = 2;

function buildService() {
  const prisma = {
    notification: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      createMany: jest.fn().mockResolvedValue({ count: 0 }),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };

  return { service: new NotificationService(prisma as never), prisma };
}

describe('NotificationService.notify', () => {
  it('ne se notifie pas soi-meme', async () => {
    const { service, prisma } = buildService();

    const result = await service.notify({
      userId: ME,
      actorId: ME,
      type: NotificationType.JOIN_REQUEST,
    });

    expect(result).toBeNull();
    expect(prisma.notification.create).not.toHaveBeenCalled();
  });

  it('cree la notification quand l acteur est quelqu un d autre', async () => {
    const { service, prisma } = buildService();

    await service.notify({
      userId: ME,
      actorId: OTHER,
      type: NotificationType.JOIN_APPROVED,
    });

    expect(prisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: ME, actorId: OTHER }),
      }),
    );
  });
});

describe('NotificationService.notifyMany', () => {
  it('retire l acteur de la liste des destinataires', async () => {
    const { service, prisma } = buildService();

    await service.notifyMany([ME, OTHER, 3], {
      actorId: OTHER,
      type: NotificationType.JOIN_REQUEST,
    });

    const [call] = prisma.notification.createMany.mock.calls;
    const recipients = call[0].data.map((row: { userId: number }) => row.userId);

    expect(recipients).toEqual([ME, 3]);
  });

  it('n ecrit rien quand l acteur est le seul destinataire', async () => {
    const { service, prisma } = buildService();

    await service.notifyMany([OTHER], {
      actorId: OTHER,
      type: NotificationType.JOIN_REQUEST,
    });

    expect(prisma.notification.createMany).not.toHaveBeenCalled();
  });

  it('ecrit tout le monde en une seule requete', async () => {
    const { service, prisma } = buildService();

    await service.notifyMany([1, 2, 3], {
      type: NotificationType.JOIN_REQUEST,
    });

    expect(prisma.notification.createMany).toHaveBeenCalledTimes(1);
  });
});

describe('NotificationService.markAllRead', () => {
  it('ne touche que les notifications non lues de l utilisateur', async () => {
    const { service, prisma } = buildService();

    await service.markAllRead(ME);

    expect(prisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: ME, readAt: null } }),
    );
  });
});
