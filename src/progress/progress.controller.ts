import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from '../guards';
import { PROGRESS_SERVICE_TOKEN, ProgressServiceContract } from './contracts';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(IsAuthenticatedGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    @Inject(PROGRESS_SERVICE_TOKEN)
    private readonly progressService: ProgressServiceContract,
  ) {}

  @Get('/')
  async findMine(
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const progress = await this.progressService.findAllForUser(req.user.id);
      return res.status(HttpStatus.OK).json(progress);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:subChapterId')
  @ApiParam({ name: 'subChapterId', example: 3 })
  async complete(
    @Param('subChapterId', ParseIntPipe) subChapterId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const progress = await this.progressService.complete(
        req.user.id,
        subChapterId,
      );
      return res.status(HttpStatus.OK).json(progress);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/:subChapterId')
  @ApiParam({ name: 'subChapterId', example: 3 })
  async uncomplete(
    @Param('subChapterId', ParseIntPipe) subChapterId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.progressService.uncomplete(req.user.id, subChapterId);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
