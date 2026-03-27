import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  PaginatedResult,
  PaginationParams,
} from 'src/common/interfaces/pagination.interface';
import { PrismaService } from 'src/prisma/prisma.service';

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserPublic = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findUserById(userId: number): Promise<User | null> {
    if (!userId) {
      return null;
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  findAllSafe(): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: userPublicSelect,
    });
  }

  async findAllSafePaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<UserPublic>> {
    const { page, limit, enablePagination } = params;

    if (!enablePagination) {
      const data = await this.prisma.user.findMany({
        orderBy: { id: 'asc' },
        select: userPublicSelect,
      });
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        enablePagination: false,
      };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { id: 'asc' },
        select: userPublicSelect,
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      enablePagination: true,
    };
  }

  findByIdSafe(id: number): Promise<UserPublic | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  async setActive(id: number, active: boolean): Promise<UserPublic | null> {
    const exists = await this.prisma.user.findUnique({ where: { id } });

    if (!exists) {
      return null;
    }

    return this.prisma.user.update({
      where: { id },
      data: { active },
      select: userPublicSelect,
    });
  }
}
