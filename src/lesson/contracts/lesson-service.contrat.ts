import { Lesson } from '@prisma/client';
import { LessonCreateDTO } from 'src/lesson/dto/lesson-create.dto';
import { LessonUpdateDTO } from 'src/lesson/dto/lesson-update.dto';

export interface LessonServiceContract {
  findAll(): Promise<Lesson[]>;
  findById(id: number): Promise<Lesson>;
  create(dto: LessonCreateDTO): Promise<Lesson>;
  update(id: number, dto: LessonUpdateDTO): Promise<Lesson>;
  delete(id: number): Promise<void>;
}
