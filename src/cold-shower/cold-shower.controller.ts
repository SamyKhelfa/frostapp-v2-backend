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
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from '../guards';
import {
  COLD_SHOWER_SERVICE_TOKEN,
  ColdShowerServiceContract,
} from './contracts';
import { LogColdShowerDTO } from './dto';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@ApiTags('Cold showers')
@ApiBearerAuth()
@UseGuards(IsAuthenticatedGuard)
@Controller('cold-showers')
export class ColdShowerController {
  constructor(
    @Inject(COLD_SHOWER_SERVICE_TOKEN)
    private readonly coldShowerService: ColdShowerServiceContract,
  ) {}

  @Get('/stats')
  async stats(@Req() req: { user: { id: number } }, @Res() res: Response) {
    try {
      const stats = await this.coldShowerService.stats(req.user.id);
      return res.status(HttpStatus.OK).json(stats);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/')
  @ApiQuery({ name: 'from', example: '2026-08-01' })
  @ApiQuery({ name: 'to', example: '2026-08-31' })
  async list(
    @Query('from') from: string,
    @Query('to') to: string,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      if (!DAY_PATTERN.test(from ?? '') || !DAY_PATTERN.test(to ?? '')) {
        throw new HttpException(
          'from et to doivent etre au format AAAA-MM-JJ',
          HttpStatus.BAD_REQUEST,
        );
      }

      const entries = await this.coldShowerService.listBetween(
        req.user.id,
        from,
        to,
      );
      return res.status(HttpStatus.OK).json(entries);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/')
  @ApiBody({ type: LogColdShowerDTO })
  async log(
    @Body() body: LogColdShowerDTO,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const entry = await this.coldShowerService.log(req.user.id, body);
      return res.status(HttpStatus.OK).json(entry);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/:date')
  async remove(
    @Param('date') date: string,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      if (!DAY_PATTERN.test(date)) {
        throw new HttpException(
          'date doit etre au format AAAA-MM-JJ',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.coldShowerService.remove(req.user.id, date);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
