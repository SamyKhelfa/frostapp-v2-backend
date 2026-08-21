import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserProgress } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProgressServiceContract } from './contracts';

@Injectable()
export class ProgressService implements ProgressServiceContract {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  findAllForUser(userId: number): Promise<UserProgress[]> {
    return this.prisma.userProgress.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  async complete(
    userId: number,
    subChapterId: number,
  ): Promise<UserProgress> {
    const subChapter = await this.prisma.subChapter.findUnique({
      where: { id: subChapterId },
    });

    if (!subChapter) {
      throw new HttpException('SubChapter not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.userProgress.upsert({
      where: { userId_subChapterId: { userId, subChapterId } },
      create: { userId, subChapterId },
      update: {},
    });
  }

  async uncomplete(userId: number, subChapterId: number): Promise<void> {
    await this.prisma.userProgress.deleteMany({
      where: { userId, subChapterId },
    });
  }
}
