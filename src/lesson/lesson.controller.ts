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

  // @Post("/lesson")
  // async create(
  //   @Res() res: Response,
  //   @Req() req: Request
  //   @ApiBody({
      

  //   })
  // ) {
  //   return res.status(HttpStatus.OK).send([])
  // }

}

