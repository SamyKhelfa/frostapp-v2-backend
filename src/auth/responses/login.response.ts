import { User } from '@prisma/client'

export interface ILoginResponse {
    user: User
    authToken: string;
}