import { User } from '@prisma/client';
import { LoginDTO, RegisterDTO } from '../dto';
import { ILoginResponse, IRegisterResponse } from '../responses';

export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE';

/**
 * Contrat du service d'authentification.
 * Toute implémentation doit fournir login et register.
 */
export interface AuthServiceContract {
  /**
   * Authentifie un utilisateur avec email et mot de passe.
   * @param dto - Email et mot de passe
   * @returns Utilisateur et token JWT
   */
  login(dto: LoginDTO): Promise<ILoginResponse>;

  /**
   * Crée un compte utilisateur.
   * @param dto - Email, nom et mot de passe
   * @returns Utilisateur créé et token JWT
   */
  register(dto: RegisterDTO): Promise<IRegisterResponse>;
}
