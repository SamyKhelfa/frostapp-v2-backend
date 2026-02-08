import { Chapter } from '@prisma/client';
import { ChapterCreateDTO } from '../dto/chapter-create.dto';
import { ChapterUpdateDTO } from '../dto/chapter-update.dto';

export const CHAPTER_SERVICE_TOKEN = 'CHAPTER_SERVICE';

/**
 * Contrat du service des chapitres.
 * Toute implémentation doit fournir le CRUD des chapitres.
 */
export interface IChapterServiceContract {
  /**
   * Liste tous les chapitres.
   */
  findAll(): Promise<Chapter[]>;

  /**
   * Récupère un chapitre par son id.
   * @param id - Identifiant du chapitre
   */
  findOne(id: number): Promise<Chapter>;

  /**
   * Crée un chapitre.
   * @param dto - Données de création
   */
  create(dto: ChapterCreateDTO): Promise<Chapter>;

  /**
   * Met à jour un chapitre.
   * @param id - Identifiant du chapitre
   * @param dto - Données de mise à jour
   */
  update(id: number, dto: ChapterUpdateDTO): Promise<Chapter>;

  /**
   * Supprime un chapitre.
   * @param id - Identifiant du chapitre
   */
  delete(id: number): Promise<void>;
}
