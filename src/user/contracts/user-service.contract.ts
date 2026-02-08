import { User } from '@prisma/client';

export const USER_SERVICE_TOKEN = 'USER_SERVICE';

/**
 * Contrat du service utilisateur.
 * Toute implémentation doit permettre de récupérer un utilisateur par son id.
 */
export interface IUserServiceContract {
  /**
   * Récupère un utilisateur par son identifiant.
   * @param userId - Identifiant de l'utilisateur
   * @returns L'utilisateur ou null si non trouvé
   */
  findUserById(userId: number): Promise<User | null>;
}
