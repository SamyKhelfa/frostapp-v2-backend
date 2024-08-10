import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { RegisterDTO } from './dto'
import { IRegisterResponse } from './responses'
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
    constructor(
        @Inject(PrismaService)
        private prisma: PrismaService,
        @Inject(JwtService)
        private jwtService: JwtService
    ) {}

    private getToken(user: User): string {
        return this.jwtService.sign({
            userId: user.id
        })
    }

    async register(dto: RegisterDTO): Promise<IRegisterResponse> {
        const { password, name, email } = dto;

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword
            }
        })

        const authToken = this.getToken(user);

        user.password = "";

        return {
            user,
            authToken
        }
    }
}
