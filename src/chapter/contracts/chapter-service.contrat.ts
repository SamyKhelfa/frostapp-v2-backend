import { Chapter } from '@prisma/client';
import { ChapterCreateDTO } from 'src/chapter/dto/chapter-create.dto';
import { ChapterUpdateDTO } from 'src/chapter/dto/chapter-update.dto';
import {
  PaginatedResult,
  PaginationParams,
} from 'src/common/interfaces/pagination.interface';

export const CHAPTER_SERVICE_TOKEN = 'CHAPTER_SERVICE';

export interface ChapterServiceContract {
  findAllSafePaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Chapter>>;
  findAll(): Promise<Chapter[]>;
  findById(id: number): Promise<Chapter>;
  create(dto: ChapterCreateDTO): Promise<Chapter>;
  update(id: number, dto: ChapterUpdateDTO): Promise<Chapter>;
  delete(id: number): Promise<void>;
}
