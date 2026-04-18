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
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from '@prisma/client';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsAuthenticatedGuard } from '../guards';
import { CHAPTER_SERVICE_TOKEN, ChapterServiceContract } from './contracts';
import { ChapterCreateDTO } from './dto/chapter-create.dto';
import { ChapterUpdateDTO } from './dto/chapter-update.dto';

@ApiTags('Chapter')
@Controller({
  path: 'chapters',
  version: '1',
})
export class ChapterController {
  constructor(
    @Inject(CHAPTER_SERVICE_TOKEN)
    private readonly chapterService: ChapterServiceContract,
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
      const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(limitStr ?? '10', 10) || 10),
      );
      const enablePagination = !['false', '0'].includes(
        String(enablePaginationStr ?? 'true').toLowerCase(),
      );
      const result = await this.chapterService.findAllSafePaginated({
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
  @Get('/:chapterId')
  @ApiParam({
    name: 'chapterId',
    example: 1,
    description: 'The id of the chapter',
  })
  async findById(@Param('chapterId') chapterId: string, @Res() res: Response) {
    try {
      const chapter = await this.chapterService.findById(Number(chapterId));

      return res.status(HttpStatus.OK).send(chapter);
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
    description: 'chapter',
    type: ChapterCreateDTO,
  })
  async create(
    @Body() body: ChapterCreateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const chapter = await this.chapterService.create(body);

      return res.status(HttpStatus.CREATED).send(chapter);
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
  @Put('/:chapterId')
  @ApiParam({
    name: 'chapterId',
    example: 1,
    description: 'The id of the chapter',
  })
  @ApiBody({
    description: 'chapter',
    type: ChapterUpdateDTO,
  })
  async update(
    @Param('chapterId') chapterId: string,
    @Body() dto: ChapterUpdateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const chapter = await this.chapterService.update(Number(chapterId), dto);

      return res.status(HttpStatus.OK).send(chapter);
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
  @Delete('/:chapterId')
  @ApiParam({
    name: 'chapterId',
    example: 1,
    description: 'The id of the chapter',
  })
  async delete(
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.chapterService.delete(Number(chapterId));

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
