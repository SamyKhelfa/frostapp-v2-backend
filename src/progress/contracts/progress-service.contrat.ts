import { UserProgress } from '@prisma/client';

export const PROGRESS_SERVICE_TOKEN = 'PROGRESS_SERVICE';

export interface ProgressServiceContract {
  findAllForUser(userId: number): Promise<UserProgress[]>;

  complete(userId: number, subChapterId: number): Promise<UserProgress>;

  uncomplete(userId: number, subChapterId: number): Promise<void>;
}
