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

  /**
   * Demande de réinitialisation de mot de passe.
   * Envoie un email si le compte existe. Renvoie toujours un message générique
   * pour éviter l'énumération d'emails.
   * @param email - Email pour lequel on demande la réinitialisation
   * @returns Message générique
   */
  forgotPassword(email: string): Promise<{ message: string }>;
}
