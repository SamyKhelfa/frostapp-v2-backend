import { Lesson } from '@prisma/client';
import { LessonCreateDTO } from '../dto';
import { LessonUpdateDTO } from '../dto/lesson-update.dto';

export const LESSON_SERVICE_TOKEN = 'LESSON_SERVICE';

/**
 * Contrat du service des leçons.
 * Toute implémentation doit fournir le CRUD des leçons.
 */
export interface ILessonServiceContract {
  /**
   * Liste toutes les leçons.
   */
  findAll(): Promise<Lesson[]>;

  /**
   * Récupère une leçon par son id.
   * @param id - Identifiant de la leçon
   */
  findById(id: number): Promise<Lesson>;

  /**
   * Crée une leçon.
   * @param dto - Données de création
   */
  create(dto: LessonCreateDTO): Promise<Lesson>;

  /**
   * Met à jour une leçon.
   * @param id - Identifiant de la leçon
   * @param dto - Données de mise à jour
   */
  update(id: number, dto: LessonUpdateDTO): Promise<Lesson>;

  /**
   * Supprime une leçon.
   * @param id - Identifiant de la leçon
   */
  delete(id: number): Promise<void>;
}
