import { User } from '@prisma/client';
import { LoginDTO, RegisterDTO } from '../dto';
import { ILoginResponse, IRegisterResponse } from '../responses';

export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE';


export interface AuthServiceContract {
  login(dto: LoginDTO): Promise<ILoginResponse>;

  register(dto: RegisterDTO): Promise<IRegisterResponse>;

  forgotPassword(email: string): Promise<{ message: string }>;

  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }>;
}
