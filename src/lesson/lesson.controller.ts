import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Post,
    Req,
    Res,
  } from '@nestjs/common'; 
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service'
import { LessonCreateDTO } from './dto';
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
    return res.status(HttpStatus.OK).send([])
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
}

