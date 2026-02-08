import { SubChapter } from '@prisma/client';
import { SubChapterCreateDTO } from '../dto/subchapter-create.dto';
import { SubChapterUpdateDTO } from '../dto/subchapter-update.dto';

export const SUBCHAPTER_SERVICE_TOKEN = 'SUBCHAPTER_SERVICE';

/**
 * Contrat du service des sous-chapitres.
 * Toute implémentation doit fournir le CRUD des sous-chapitres.
 */
export interface ISubChapterServiceContract {
  /**
   * Liste tous les sous-chapitres.
   */
  findAll(): Promise<SubChapter[]>;

  /**
   * Récupère un sous-chapitre par son id.
   * @param id - Identifiant du sous-chapitre
   */
  findOne(id: number): Promise<SubChapter>;

  /**
   * Crée un sous-chapitre.
   * @param dto - Données de création
   */
  create(dto: SubChapterCreateDTO): Promise<SubChapter>;

  /**
   * Met à jour un sous-chapitre.
   * @param id - Identifiant du sous-chapitre
   * @param dto - Données de mise à jour
   */
  update(id: number, dto: SubChapterUpdateDTO): Promise<SubChapter>;

  /**
   * Supprime un sous-chapitre.
   * @param id - Identifiant du sous-chapitre
   */
  delete(id: number): Promise<void>;
}
