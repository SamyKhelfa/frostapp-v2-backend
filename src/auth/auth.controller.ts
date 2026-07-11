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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from './dto';
import { AUTH_SERVICE_TOKEN, AuthServiceContract } from './contracts';
import { IsAuthenticatedGuard } from '../guards';

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

  @Get('/me')
  @UseGuards(IsAuthenticatedGuard)
  @ApiBearerAuth()
  me(@Req() req: { user: unknown }) {
    return req.user;
  }

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

  @Post('/forgot-password')
  @ApiBody({
    description: 'Demande de réinitialisation de mot de passe',
    type: ForgotPasswordDTO,
  })
  async forgotPassword(
    @Body() body: ForgotPasswordDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.authService.forgotPassword(body.email);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/reset-password')
  @ApiBody({ type: ResetPasswordDTO })
  async resetPassword(
    @Body() body: ResetPasswordDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.authService.resetPassword(
        body.token,
        body.newPassword,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
