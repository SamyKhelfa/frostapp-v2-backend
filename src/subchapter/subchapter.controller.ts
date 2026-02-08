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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRolesEnum } from '@prisma/client';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { IsAuthenticatedGuard } from '../guards';
import { RolesGuard } from '../guards/roles.guard';
import {
  ISubChapterServiceContract,
  SUBCHAPTER_SERVICE_TOKEN,
} from './contracts';
import { SubChapterCreateDTO } from './dto/subchapter-create.dto';
import { SubChapterUpdateDTO } from './dto/subchapter-update.dto';

@ApiTags('SubChapter')
@Controller({
  path: 'subchapters',
  version: '1',
})
export class SubChapterController {
  constructor(
    @Inject(SUBCHAPTER_SERVICE_TOKEN)
    private readonly subChapterService: ISubChapterServiceContract,
  ) {}

  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
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
  @UseGuards(IsAuthenticatedGuard)
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
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
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
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
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
  @UseGuards(IsAuthenticatedGuard, RolesGuard)
  @Roles([UserRolesEnum.admin])
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
