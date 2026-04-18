import { Inject, Injectable } from '@nestjs/common';
import { Chapter } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginatedResult,
  PaginationParams,
} from '../common/interfaces/pagination.interface';
import { ChapterServiceContract } from './contracts';
import { ChapterCreateDTO } from './dto/chapter-create.dto';
import { ChapterUpdateDTO } from './dto/chapter-update.dto';

@Injectable()
export class ChapterService implements ChapterServiceContract {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  private includeData = {
    Lesson: {
      select: {
        id: true,
        title: true,
      },
    },
  };

  async findAllSafePaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Chapter>> {
    const { page, limit, enablePagination } = params;

    if (!enablePagination) {
      const data = await this.prisma.chapter.findMany({
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
      this.prisma.chapter.findMany({
        orderBy: { id: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.chapter.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      enablePagination: true,
    };
  }

  async findAll(): Promise<Chapter[]> {
    return this.prisma.chapter.findMany();
  }

  async findById(id: number): Promise<Chapter> {
    return this.prisma.chapter.findUnique({
      where: { id },
    });
  }

  async create(dto: ChapterCreateDTO): Promise<Chapter> {
    const { title, description, image, status, position, lessonId } = dto;

    return this.prisma.chapter.create({
      data: {
        title,
        description,
        image,
        status,
        position,
        Lesson: lessonId ? { connect: { id: lessonId } } : undefined,
      },
      include: this.includeData,
    });
  }

  async update(id: number, dto: ChapterUpdateDTO): Promise<Chapter> {
    const { title, description, image, status, position } = dto;

    return this.prisma.chapter.update({
      where: { id },
      include: this.includeData,
      data: {
        title,
        description,
        image,
        status,
        position,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.chapter.delete({
      where: { id },
    });
  }
}
