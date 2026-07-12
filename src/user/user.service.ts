import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  PaginatedResult,
  PaginationParams,
} from 'src/common/interfaces/pagination.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
  avatar: true,
  emailVerified: true,
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

  async updateMe(
    userId: number,
    data: { name?: string; email?: string; avatar?: string },
  ): Promise<UserPublic> {
    if (data.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== userId) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: userPublicSelect,
    });
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isCorrect = bcrypt.compareSync(currentPassword, user.password);
    if (!isCorrect) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isSameAsOld = bcrypt.compareSync(newPassword, user.password);
    if (isSameAsOld) {
      throw new HttpException(
        'New password must be different from the current one',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }
}




