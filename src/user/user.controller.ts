import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRolesEnum } from '@prisma/client';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { IsAuthenticatedGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { SetUserActiveDTO } from './dto/set-user-active.dto';
import { UserService } from './user.service';
import { UpdateMeDTO } from './dto/update-me.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'enablePagination',
    required: false,
    example: true,
    description: 'false returns all users without skip/take',
  })
  @Get('/')
  async findAll(
    @Query('page') pageStr: string | undefined,
    @Query('limit') limitStr: string | undefined,
    @Query('enablePagination') enablePaginationStr: string | undefined,
    @Res() res: Response,
  ) {
    try {
      const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(limitStr ?? '10', 10) || 10),
      );
      const enablePagination = !['false', '0'].includes(
        String(enablePaginationStr ?? 'true').toLowerCase(),
      );

      const result = await this.userService.findAllSafePaginated({
        page,
        limit,
        enablePagination,
      });

      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Get('me')
  async getMe(@Req() req: any, @Res() res: Response) {
    try {
      const user = await this.userService.findByIdSafe(req.user.id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Patch('me')
  @ApiBody({ type: UpdateMeDTO })
  async updateMe(
    @Req() req: any,
    @Body() body: UpdateMeDTO,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.updateMe(req.user.id, body);
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Patch('me/password')
  @ApiBody({ type: ChangePasswordDTO })
  async changePassword(
    @Req() req: any,
    @Body() body: ChangePasswordDTO,
    @Res() res: Response,
  ) {
    try {
      await this.userService.changePassword(
        req.user.id,
        body.currentPassword,
        body.newPassword,
      );
      return res.status(HttpStatus.OK).send({ success: true });
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }

      if (!file.mimetype.startsWith('image/')) {
        throw new HttpException(
          'File must be an image',
          HttpStatus.BAD_REQUEST,
        );
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new HttpException(
          'File too large (max 5MB)',
          HttpStatus.BAD_REQUEST,
        );
      }

      const avatarUrl = await this.cloudinaryService.uploadAvatar(file);

      const user = await this.userService.updateMe(req.user.id, {
        avatar: avatarUrl,
      });

      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
  @Get('/:id')
  @ApiParam({ name: 'id', example: 1 })
  async findById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const user = await this.userService.findByIdSafe(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
  @Patch('/:id/active')
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: SetUserActiveDTO })
  async setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SetUserActiveDTO,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.setActive(id, body.active);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).send(user);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}







