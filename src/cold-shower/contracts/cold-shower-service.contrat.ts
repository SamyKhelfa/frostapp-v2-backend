import { ColdShowerEntry } from '@prisma/client';
import { LogColdShowerDTO } from '../dto';

export const COLD_SHOWER_SERVICE_TOKEN = 'COLD_SHOWER_SERVICE';

export interface ColdShowerStats {
  currentStreak: number;
  longestStreak: number;
  total: number;
  lastEntryDate: string | null;
  loggedToday: boolean;
}

export interface ColdShowerServiceContract {
  listBetween(
    userId: number,
    from: string,
    to: string,
  ): Promise<ColdShowerEntry[]>;
  log(userId: number, dto: LogColdShowerDTO): Promise<ColdShowerEntry>;
  remove(userId: number, date: string): Promise<void>;
  stats(userId: number): Promise<ColdShowerStats>;
}
