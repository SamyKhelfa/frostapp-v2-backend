import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto';
import { AUTH_SERVICE_TOKEN, AuthServiceContract } from './contracts';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: AuthServiceContract,
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
