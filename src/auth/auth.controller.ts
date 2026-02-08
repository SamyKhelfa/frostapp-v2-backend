import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AUTH_SERVICE_TOKEN, IAuthServiceContract } from './contracts';
import { LoginDTO } from './dto';
import { RegisterDTO } from './dto/register.dto';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: IAuthServiceContract,
  ) {}

  @Post('/login')
  @ApiBody({
    description: 'login',
    type: LoginDTO,
  })
  async login(@Body() body: LoginDTO, @Res() res: Response): Promise<Response> {
    try {
      const { authToken, user } = await this.authService.login(body);

      return res.status(HttpStatus.OK).json({
        authToken,
        user,
      });
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/register')
  @ApiBody({
    description: 'register',
    type: RegisterDTO,
  })
  async register(
    @Body() body: RegisterDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { authToken, user } = await this.authService.register(body);

      return res.status(HttpStatus.CREATED).json({
        authToken,
        user,
      });
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
