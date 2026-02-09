import { Param } from '@nestjs/common';
import { Chapter } from '@prisma/client';
import { ChapterCreateDTO } from 'src/chapter/dto/chapter-create.dto';
import { ChapterUpdateDTO } from 'src/chapter/dto/chapter-update.dto';

export interface ChapterServiceContract {
  findAll(): Promise<Chapter[]>;
  findOne(id: number): Promise<Chapter>;
  create(dto: ChapterCreateDTO): Promise<Chapter>;
  update(id: number, dto: ChapterUpdateDTO): Promise<Chapter>;
  delete(id: number): Promise<void>;
}
