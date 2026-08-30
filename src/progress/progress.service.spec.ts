import { HttpException, HttpStatus } from '@nestjs/common';
import { ProgressService } from './progress.service';

const USER = 1;
const MODULE = 42;

function buildService(subChapter: unknown = { id: MODULE }) {
  const prisma = {
    subChapter: { findUnique: jest.fn().mockResolvedValue(subChapter) },
    userProgress: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({ id: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };

  return { service: new ProgressService(prisma as never), prisma };
}

async function statusOf(promise: Promise<unknown>) {
  try {
    await promise;
    return null;
  } catch (error) {
    return (error as HttpException).getStatus();
  }
}

describe('ProgressService.complete', () => {
  it('refuse un module inexistant', async () => {
    const { service } = buildService(null);

    expect(await statusOf(service.complete(USER, MODULE))).toBe(
      HttpStatus.NOT_FOUND,
    );
  });

  it('passe par un upsert, donc valider deux fois ne casse rien', async () => {
    const { service, prisma } = buildService();

    await service.complete(USER, MODULE);
    await service.complete(USER, MODULE);

    expect(prisma.userProgress.upsert).toHaveBeenCalledTimes(2);
    expect(prisma.userProgress.upsert).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { userId_subChapterId: { userId: USER, subChapterId: MODULE } },
      }),
    );
  });
});

describe('ProgressService.uncomplete', () => {
  it('ne leve pas d erreur quand rien n etait valide', async () => {
    const { service, prisma } = buildService();

    await expect(service.uncomplete(USER, MODULE)).resolves.toBeUndefined();
    expect(prisma.userProgress.deleteMany).toHaveBeenCalledWith({
      where: { userId: USER, subChapterId: MODULE },
    });
  });
});

describe('ProgressService.findAllForUser', () => {
  it('ne remonte que la progression de l utilisateur demande', async () => {
    const { service, prisma } = buildService();

    await service.findAllForUser(USER);

    expect(prisma.userProgress.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: USER } }),
    );
  });
});
