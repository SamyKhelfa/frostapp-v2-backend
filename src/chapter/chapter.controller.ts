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
  } from '@nestjs/common'; 
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiParam, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChapterService } from './chapter.service'
import { ChapterCreateDTO } from './dto/chapter-create.dto';
import { ChapterUpdateDTO } from './dto/chapter-update.dto';

@ApiTags('Chapter')
@Controller({
  path:"chapters",
  version:"1"
})

export class ChapterController{
  constructor(
    private readonly chapterService: ChapterService
  ){}

  @Get("/")
  async findAll(
    @Res() res: Response
  ) {
    try{
      const chapters = await this.chapterService.findAll()
      return res.status(HttpStatus.OK).send(chapters)
    } catch (error){
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get("/:chapterID")
  @ApiParam({
    name: "chapterId",
    example: 1,
    description: 'The id of the chapter'
  })
  async findById(
    @Param('chapterId') chapterId: string,
    @Res() res: Response
  ) {
    try {
      const chapter = await this.chapterService.findOne(Number(chapterId))
      return res.status(HttpStatus.OK).send(chapter)
    } catch (error){
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
      )
    }
  }

 @Post()
  @ApiBody({
    description: "chapter",
    type: ChapterCreateDTO
  })
  async create(
    @Body() body: ChapterCreateDTO,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const chapter = await this.chapterService.create(body);
      return res.status(HttpStatus.CREATED).json(chapter);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(":/chapterId")
  @ApiParam({
    name: "chapterId",
    example:1,
    description: "The id of the chapter",
  })
  @ApiBody({
    description:"chapter",
    type: ChapterUpdateDTO
  })
  async update(
    @Param('chapterId') chapterId: string,
    @Body() dto: ChapterUpdateDTO,
    @Res() res: Response
  ): Promise<Response>{
    try {
      const chapter = await this.chapterService.update(Number(chapterId), dto)
      return res.status(HttpStatus.OK).send(chapter)
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
    )
    }
  }

  @Delete("/:chapterId")
  @ApiParam({
    name: 'chapterId',
    example:1,
    description: "The id of the chapter",
  })
  async delete(
    @Param('chapterId') chapterId: string,
    @Res() res: Response
  ): Promise<Response>{
    try{
      await this.chapterService.delete(Number(chapterId))
      
      return res.status(HttpStatus.NO_CONTENT).send()
    } catch(error){
      error.message,
      error?.status || HttpStatus.BAD_REQUEST
    }
  }




}