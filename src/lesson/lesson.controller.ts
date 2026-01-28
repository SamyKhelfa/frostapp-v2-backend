import {
  Body,
  Param,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Put,
  Req,
  Res,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { LessonCreateDTO } from './dto';
import { LessonUpdateDTO } from './dto/lesson-update.dto';
import { IsAuthenticatedGuard } from '../guards';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { PrismaClient, UserRolesEnum } from '@prisma/client';

@ApiTags('Lesson')
@Controller({
  path: 'lessons',
  version: '1',
})
export class LessonsController {
  constructor(
    @Inject(LessonService)
    private readonly lessonService: LessonService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Get('/')
  async findAll(@Res() res: Response) {
    try {
      const lessons = await this.lessonService.findAll();
      return res.status(HttpStatus.OK).send(lessons);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Get('/:lessonId')
  @ApiParam({
    name: 'lessonId',
    example: 1,
    description: 'The id of the lesson',
  })
  async findById(@Param('lessonId') lessonId: string, @Res() res: Response) {
    try {
      const lesson = await this.lessonService.findById(Number(lessonId));

      return res.status(HttpStatus.OK).send(lesson);
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
  @Post('/')
  @ApiBody({
    description: 'lesson',
    type: LessonCreateDTO,
  })
  async create(
    @Body() body: LessonCreateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const lesson = await this.lessonService.create(body);

      return res.status(HttpStatus.CREATED).send(lesson);
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
  @Put('/:lessonId')
  @ApiParam({
    name: 'lessonId',
    example: 1,
    description: 'The id of the lesson',
  })
  @ApiBody({
    description: 'lesson',
    type: LessonUpdateDTO,
  })
  async update(
    @Param('lessonId') lessonId: string,
    @Body() dto: LessonUpdateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const lesson = await this.lessonService.update(Number(lessonId), dto);

      return res.status(HttpStatus.OK).send(lesson);
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
  @Delete('/:lessonId')
  @ApiParam({
    name: 'lessonId',
    example: 1,
    description: 'The id of the lesson',
  })
  async delete(
    @Param('lessonId') lessonId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.lessonService.delete(Number(lessonId));

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
