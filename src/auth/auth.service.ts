import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { RegisterDTO, LoginDTO } from './dto'
import { IRegisterResponse, ILoginResponse } from './responses'
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

    async login(dto: LoginDTO): Promise<ILoginResponse> {
        const { email, password } = dto;

        if(!email || !password) {
            throw new HttpException(
                'Email and password are required',
                HttpStatus.BAD_REQUEST
            )
        }

        const user = await this.prisma.user.findUnique({ where : { email } })

        if(!user) {
            throw new HttpException(
                'Email or password are incorrect',
                HttpStatus.UNAUTHORIZED
            )
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.password);

        if(!isCorrectPassword) {
            throw new HttpException(
                'Email or password are incorrect',
                HttpStatus.UNAUTHORIZED
            )
        }

        const authToken = this.getToken(user);

        user.password = ""

        return {
            user,
            authToken
        }
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
