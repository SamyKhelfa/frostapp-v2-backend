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
  } from '@nestjs/common'; 
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiParam, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service'
import { LessonCreateDTO } from './dto';
import { LessonFindByIdDTO } from './dto/lesson-find-by-id';
import { LessonUpdateDTO } from './dto/lesson-update.dto';
@ApiTags('Lesson')
@Controller({
    path: "lessons",
    version:"1"
})
export class LessonsController{
  constructor(
    @Inject(LessonService)
    private readonly lessonService: LessonService
  ){}

  @Get("/")
  async findAll (
    @Res() res: Response
  ) {
    try {
      const lessons = await this.lessonService.findAll();
      return res.status(HttpStatus.OK).send(lessons)
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
      )
    }
  }

  @Get("/:lessonId")
  @ApiParam({
    name: 'lessonId',
    example: 1,
    description: 'The id of the lesson',
  })
  async findById(
    @Param() params: LessonFindByIdDTO,
    @Res() res: Response
  ) {
    try {
      const lesson = await this.lessonService.findById(params)

      return res.status(HttpStatus.OK).send(lesson)
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post("/")
  @ApiBody({
    description: "lesson",
    type: LessonCreateDTO
  })
  async create(
    @Body() body: LessonCreateDTO,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const lesson = await this.lessonService.create(body)

      return res.status(HttpStatus.CREATED).send(lesson)
    } catch (error) {
      throw new HttpException(
          error.message,
          error?.status || HttpStatus.BAD_REQUEST
      )
  }
}

  @Put("/:lessonId")
  @ApiParam({
    name:'lessonId',
    example:1,
    description: 'The id of the lesson',
  })
  @ApiBody({
    description: "lesson",
    type: LessonUpdateDTO
  })
  async update(
    @Param('lessonId') lessonId: string,
    @Body() updateDto: LessonUpdateDTO,
    @Res() res: Response
  ): Promise<Response>{
    try {
      const lesson = await this.lessonService.update(Number(lessonId), updateDto)
      return res.status(HttpStatus.OK).send(lesson)
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST
    )
    }
  }


  }

  



