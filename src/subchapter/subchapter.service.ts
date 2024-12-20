import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubChapterCreateDTO } from './dto/subchapter-create.dto';
import { getConnectIds } from 'src/utils';
import { Prisma, SubChapter } from '@prisma/client';
import { SubChapterUpdateDTO } from './dto/subchapter-update.dto';

@Injectable()
export class SubChapterService {
  constructor(private prisma: PrismaService) {}

  private includeData = {
    Chapter: {
      select: {
        id: true,
        title: true,
      },
    },
  };

  async findAll(): Promise<SubChapter[]> {
    return this.prisma.subChapter.findMany();
  }

  async findOne(id: number): Promise<SubChapter> {
    return this.prisma.subChapter.findUnique({
      where: { id },
    });
  }

  async create(dto: SubChapterCreateDTO): Promise<SubChapter> {
    const {
      title,
      description,
      active,
      duration,
      video,
      status,
      position,
      chapterId,
    } = dto;

    return this.prisma.subChapter.create({
      data: {
        title,
        description,
        duration,
        active,
        video,
        status,
        position,
        Chapter: chapterId ? { connect: { id: chapterId } } : undefined,
      },
      include: this.includeData,
    });
  }

  async update(id: number, dto: SubChapterUpdateDTO): Promise<SubChapter> {
    const {
      title,
      description,
      duration,
      active,
      video,
      status,
      position,
      chapterId,
    } = dto;

    return this.prisma.subChapter.update({
      where: { id },
      include: this.includeData,
      data: {
        title,
        description,
        video,
        duration,
        active,
        status,
        position,
        chapterId,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.subChapter.delete({
      where: { id },
    });
  }
}
