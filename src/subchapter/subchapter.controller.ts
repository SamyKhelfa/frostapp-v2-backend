import {
  Body,
  Param,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Res,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { SubChapterCreateDTO } from './dto/subchapter-create.dto';
import { SubChapterUpdateDTO } from './dto/subchapter-update.dto';
import { SubChapterService } from './subchapter.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('SubChapter')
@Controller({
  path: 'subchapters',
  version: '1',
})
export class SubChapterController {
  constructor(private readonly subChapterService: SubChapterService) {}

  @ApiBearerAuth()
  @Get('/')
  async findAll(@Res() res: Response) {
    try {
      const chapters = await this.subChapterService.findAll();
      return res.status(HttpStatus.OK).json(chapters);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get('/:subchapterId')
  @ApiParam({
    name: 'subchapterId',
    example: 1,
    description: 'The id of the chapter',
  })
  async findById(
    @Param('subchapterId') subChapterId: string,
    @Res() res: Response,
  ) {
    try {
      const subChapter = await this.subChapterService.findOne(
        Number(subChapterId),
      );
      return res.status(HttpStatus.OK).send(subChapter);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Post()
  @ApiBody({
    description: 'subchapter',
    type: SubChapterCreateDTO,
  })
  async create(
    @Body() body: SubChapterCreateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const subChapter = await this.subChapterService.create(body);
      return res.status(HttpStatus.CREATED).send(subChapter);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Put('/:subchapterId')
  @ApiParam({
    name: 'subchapterId',
    example: 1,
    description: 'The id of the chapter',
  })
  @ApiBody({
    description: 'subchapter',
    type: SubChapterUpdateDTO,
  })
  async update(
    @Param('subchapterId') subChapterId: string,
    @Body() dto: SubChapterUpdateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const subChapter = await this.subChapterService.update(
        Number(subChapterId),
        dto,
      );
      return res.status(HttpStatus.OK).send(subChapter);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Delete('/:subchapterId')
  @ApiParam({
    name: 'subchapterId',
    example: 1,
    description: 'The id of the subchapter',
  })
  async delete(
    @Param('subchapterId') subChapterId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.subChapterService.delete(Number(subChapterId));
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
