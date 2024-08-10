import { User } from '@prisma/client'

export interface IRegisterResponse {
    user: User
    authToken: string;
}