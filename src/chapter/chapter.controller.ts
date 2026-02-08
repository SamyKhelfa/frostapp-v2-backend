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
  Res,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ChapterCreateDTO } from './dto/chapter-create.dto';
import { ChapterUpdateDTO } from './dto/chapter-update.dto';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRolesEnum } from '@prisma/client';
import { CHAPTER_SERVICE_TOKEN, IChapterServiceContract } from './contracts';

@ApiTags('Chapter')
@Controller({
  path: 'chapters',
  version: '1',
})
export class ChapterController {
  constructor(
    @Inject(CHAPTER_SERVICE_TOKEN)
    private readonly chapterService: IChapterServiceContract,
  ) {}

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  @Get('/')
  async findAll(@Res() res: Response) {
    try {
      const chapters = await this.chapterService.findAll();
      return res.status(HttpStatus.OK).send(chapters);
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
      const chapter = await this.chapterService.findOne(Number(chapterId));
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
  @Post()
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
      return res.status(HttpStatus.CREATED).json(chapter);
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
      console.log(chapterId);
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
