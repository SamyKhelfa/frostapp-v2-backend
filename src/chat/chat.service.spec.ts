import { HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';

const CONVERSATION_ID = 7;
const ME = 1;

function buildService(participant: unknown, conversation: unknown = { id: CONVERSATION_ID, type: 'DIRECT' }) {
  const prisma = {
    conversation: { findUnique: jest.fn().mockResolvedValue(conversation) },
    conversationParticipant: {
      findUnique: jest.fn().mockResolvedValue(participant),
    },
    message: { findMany: jest.fn().mockResolvedValue([]) },
  };

  const notifications = { notify: jest.fn(), notifyMany: jest.fn() };

  return new ChatService(prisma as never, notifications as never);
}

async function statusOf(promise: Promise<unknown>) {
  try {
    await promise;
    return null;
  } catch (error) {
    return (error as HttpException).getStatus();
  }
}

describe('ChatService : acces a une conversation', () => {
  it('refuse quelqu un qui n est pas participant', async () => {
    const service = buildService(null);

    const status = await statusOf(service.listMessages(ME, CONVERSATION_ID));

    expect(status).toBe(HttpStatus.FORBIDDEN);
  });

  it('refuse une demande encore en attente', async () => {
    const service = buildService({ userId: ME, status: 'PENDING' });

    const status = await statusOf(service.listMessages(ME, CONVERSATION_ID));

    expect(status).toBe(HttpStatus.FORBIDDEN);
  });

  it('refuse une conversation inexistante', async () => {
    const service = buildService(null, null);

    const status = await statusOf(service.listMessages(ME, CONVERSATION_ID));

    expect(status).toBe(HttpStatus.NOT_FOUND);
  });

  it('autorise un membre actif', async () => {
    const service = buildService({ userId: ME, status: 'ACTIVE' });

    await expect(
      service.listMessages(ME, CONVERSATION_ID),
    ).resolves.toEqual([]);
  });

  it('refuse aussi sur une communaute publique si on n y est pas', async () => {
    const service = buildService(null, {
      id: CONVERSATION_ID,
      type: 'COMMUNITY',
    });

    const status = await statusOf(service.listMessages(ME, CONVERSATION_ID));

    expect(status).toBe(HttpStatus.FORBIDDEN);
  });
});

describe('ChatService : cle de conversation privee', () => {
  it('donne la meme cle quel que soit le sens', () => {
    const service = buildService(null) as unknown as {
      buildPairKey: (a: number, b: number) => string;
    };
    const build = (a: number, b: number) =>
      (service as never as { buildPairKey: (x: number, y: number) => string })
        .buildPairKey(a, b);

    expect(build(12, 45)).toBe(build(45, 12));
    expect(build(12, 45)).toBe('12-45');
  });
});
