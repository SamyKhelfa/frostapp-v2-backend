import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ColdShowerEntry } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ColdShowerServiceContract, ColdShowerStats } from './contracts';
import { LogColdShowerDTO } from './dto';

const GRACE_HOUR = 6;

export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function shiftDay(key: string, delta: number): string {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return toDayKey(date);
}

export function toDateOnly(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

export function currentStreakFrom(
  descendingKeys: string[],
  todayKey: string,
): number {
  if (descendingKeys.length === 0) return 0;

  const mostRecent = descendingKeys[0];
  const yesterdayKey = shiftDay(todayKey, -1);

  if (mostRecent !== todayKey && mostRecent !== yesterdayKey) return 0;

  let streak = 1;
  let cursor = mostRecent;

  for (let i = 1; i < descendingKeys.length; i += 1) {
    const expected = shiftDay(cursor, -1);
    if (descendingKeys[i] !== expected) break;
    streak += 1;
    cursor = expected;
  }

  return streak;
}

export function longestStreakFrom(descendingKeys: string[]): number {
  if (descendingKeys.length === 0) return 0;

  let longest = 1;
  let run = 1;

  for (let i = 1; i < descendingKeys.length; i += 1) {
    if (descendingKeys[i] === shiftDay(descendingKeys[i - 1], -1)) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
  }

  return longest;
}

@Injectable()
export class ColdShowerService implements ColdShowerServiceContract {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  private effectiveTodayKey(now: Date = new Date()): string {
    const reference = new Date(now);

    if (reference.getHours() < GRACE_HOUR) {
      reference.setDate(reference.getDate() - 1);
    }

    const year = reference.getFullYear();
    const month = String(reference.getMonth() + 1).padStart(2, '0');
    const day = String(reference.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  listBetween(
    userId: number,
    from: string,
    to: string,
  ): Promise<ColdShowerEntry[]> {
    return this.prisma.coldShowerEntry.findMany({
      where: {
        userId,
        date: { gte: toDateOnly(from), lte: toDateOnly(to) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async log(
    userId: number,
    dto: LogColdShowerDTO,
  ): Promise<ColdShowerEntry> {
    const dayKey = dto.date ?? this.effectiveTodayKey();

    if (dayKey > this.effectiveTodayKey()) {
      throw new HttpException(
        'Impossible de valider une journee a venir',
        HttpStatus.BAD_REQUEST,
      );
    }

    const date = toDateOnly(dayKey);

    return this.prisma.coldShowerEntry.upsert({
      where: { userId_date: { userId, date } },
      create: { userId, date, feeling: dto.feeling, notes: dto.notes },
      update: { feeling: dto.feeling, notes: dto.notes },
    });
  }

  async remove(userId: number, date: string): Promise<void> {
    await this.prisma.coldShowerEntry.deleteMany({
      where: { userId, date: toDateOnly(date) },
    });
  }

  async stats(userId: number): Promise<ColdShowerStats> {
    const entries = await this.prisma.coldShowerEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    const keys = entries.map((entry) => toDayKey(entry.date));
    const todayKey = this.effectiveTodayKey();

    return {
      currentStreak: currentStreakFrom(keys, todayKey),
      longestStreak: longestStreakFrom(keys),
      total: keys.length,
      lastEntryDate: keys[0] ?? null,
      loggedToday: keys[0] === todayKey,
    };
  }
}
