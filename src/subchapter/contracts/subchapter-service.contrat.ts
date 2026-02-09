import { SubChapter } from '@prisma/client';
import { SubChapterCreateDTO } from '../dto/subchapter-create.dto';
import { SubChapterUpdateDTO } from '../dto/subchapter-update.dto';

export interface SubChapterServiceContract {
  findAll(): Promise<SubChapter[]>;
  findOne(id: number): Promise<SubChapter>;
  create(dto: SubChapterCreateDTO): Promise<SubChapter>;
  update(id: number, dto: SubChapterUpdateDTO): Promise<SubChapter>;
  delete(id: number): Promise<void>;
}
