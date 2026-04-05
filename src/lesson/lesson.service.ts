import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LessonCreateDTO } from './dto';
import { getConnectIds } from '../utils';
import { Lesson } from '@prisma/client';
import { LessonUpdateDTO } from './dto/lesson-update.dto';
import { LessonServiceContract } from './contracts';
import { PaginatedResult,
        PaginationParams,
} from 'src/common/interfaces/pagination.interface'

@Injectable()
export class LessonService implements LessonServiceContract {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  private includeData = {
    chapters: true,
    users: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  async findAllSafePaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Lesson>> {
    const { page, limit, enablePagination } = params;

    if(!enablePagination) {
      const data = await this.prisma.lesson.findMany({
        orderBy: { id: 'asc' },
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
      this.prisma.lesson.findMany({
        orderBy: { id: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.lesson.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      enablePagination: true,
    };
  }

  async findAll(): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      include: this.includeData,
    });
  }

  async findById(id: number): Promise<Lesson> {
    return this.prisma.lesson.findUnique({
      where: {
        id,
      },
      include: this.includeData,
    });
  }

  async update(id: number, dto: LessonUpdateDTO): Promise<Lesson> {
    const { title, description, chapters } = dto;

    return this.prisma.lesson.update({
      where: { id },
      include: this.includeData,
      data: {
        title,
        description,
        chapters: {
          connect: getConnectIds(chapters),
        },
      },
    });
  }

  async create(dto: LessonCreateDTO): Promise<Lesson> {
    const { title, description, users, chapters } = dto;

    return this.prisma.lesson.create({
      include: this.includeData,
      data: {
        title,
        description,
        users: {
          connect: getConnectIds(users),
        },
        chapters: {
          connect: getConnectIds(chapters),
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.lesson.delete({
      where: { id },
    });
  }
}
