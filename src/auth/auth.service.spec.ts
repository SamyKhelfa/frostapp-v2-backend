import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

const FIXTURE_PLAINTEXT = 'fixture-not-a-real-credential';

function buildUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    email: 'member@example.test',
    name: 'Sam',
    password: bcrypt.hashSync(FIXTURE_PLAINTEXT, 10),
    active: true,
    ...overrides,
  };
}

function buildService(user: unknown) {
  const prisma = {
    user: { findUnique: jest.fn().mockResolvedValue(user) },
  };
  const jwtService = { sign: jest.fn().mockReturnValue('signed-token') };
  const emailService = { sendEmail: jest.fn().mockResolvedValue(undefined) };

  return new AuthService(
    prisma as never,
    jwtService as never,
    emailService as never,
  );
}

async function statusOf(promise: Promise<unknown>) {
  try {
    await promise;
    return null;
  } catch (error) {
    return (error as HttpException).getStatus();
  }
}

describe('AuthService.login', () => {
  it('refuse un email inconnu', async () => {
    const service = buildService(null);

    const status = await statusOf(
      service.login({
        email: 'unknown@example.test',
        password: FIXTURE_PLAINTEXT,
      }),
    );

    expect(status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('refuse un mauvais mot de passe', async () => {
    const service = buildService(buildUser());

    const status = await statusOf(
      service.login({
        email: 'member@example.test',
        password: 'wrong-fixture-value',
      }),
    );

    expect(status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('refuse un compte desactive, meme avec le bon mot de passe', async () => {
    const service = buildService(buildUser({ active: false }));

    const status = await statusOf(
      service.login({
        email: 'member@example.test',
        password: FIXTURE_PLAINTEXT,
      }),
    );

    expect(status).toBe(HttpStatus.FORBIDDEN);
  });

  it('renvoie un token et efface le mot de passe quand tout est bon', async () => {
    const service = buildService(buildUser());

    const result = await service.login({
      email: 'member@example.test',
      password: FIXTURE_PLAINTEXT,
    });

    expect(result.authToken).toBe('signed-token');
    expect(result.user.password).toBe('');
  });
});
