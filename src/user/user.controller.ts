import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from '@prisma/client';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { IsAuthenticatedGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { SetUserActiveDTO } from './dto/set-user-active.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
  @Get('/')
  async findAll(@Res() res: Response) {
    try {
      const users = await this.userService.findAllSafe();
      return res.status(HttpStatus.OK).send(users);
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
