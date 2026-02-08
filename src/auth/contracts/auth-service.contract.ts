import { LoginDTO } from '../dto';
import { RegisterDTO } from '../dto/register.dto';
import { ILoginResponse } from '../responses';
import { IRegisterResponse } from '../responses/register.response';

export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE';

/**
 * Contrat du service d'authentification.
 * Toute implémentation doit fournir login et register.
 */
export interface IAuthServiceContract {
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
