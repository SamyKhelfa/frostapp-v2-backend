import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put, Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from '@prisma/client';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsAuthenticatedGuard } from '../guards';
import { LessonCreateDTO } from './dto';
import { LessonUpdateDTO } from './dto/lesson-update.dto';
import { LessonService } from './lesson.service';

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
  async findAll(
    @Query('page') pageStr: string | undefined,
    @Query('limit') limitStr: string | undefined,
    @Query('unablePagination') enablePaginationStr: string | undefined,
    @Res() res: Response,
  ) {
    try {
      const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)
      const limit = Math.min(
        100,
        Math.max(1, parseInt(limitStr ?? '10', 10) || 10),
        )
      const enablePagination = !['false', '0'].includes(
        String(enablePaginationStr ?? 'true').toLowerCase(),
      )
      const result = await this.lessonService.findAllSafePaginated({
        page,
        limit,
        enablePagination,
      });
      return res.status(HttpStatus.OK).send(result)
    }
       catch (error) {
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
