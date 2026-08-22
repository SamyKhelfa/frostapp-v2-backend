import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from '../guards';
import { CHAT_SERVICE_TOKEN, ChatServiceContract } from './contracts';
import { CreateCommunityDTO, SendMessageDTO, SetMutedDTO } from './dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(IsAuthenticatedGuard)
@Controller('conversations')
export class ChatController {
  constructor(
    @Inject(CHAT_SERVICE_TOKEN)
    private readonly chatService: ChatServiceContract,
  ) {}

  @Get('/')
  async list(@Req() req: { user: { id: number } }, @Res() res: Response) {
    try {
      const conversations = await this.chatService.listForUser(req.user.id);
      return res.status(HttpStatus.OK).json(conversations);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/community')
  async community(@Req() req: { user: { id: number } }, @Res() res: Response) {
    try {
      const conversation = await this.chatService.getCommunity(req.user.id);
      return res.status(HttpStatus.OK).json(conversation);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/communities')
  async communities(
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const list = await this.chatService.listCommunities(req.user.id);
      return res.status(HttpStatus.OK).json(list);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/communities')
  @ApiBody({ type: CreateCommunityDTO })
  async createCommunity(
    @Body() body: CreateCommunityDTO,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const community = await this.chatService.createCommunity(
        req.user.id,
        body,
      );
      return res.status(HttpStatus.CREATED).json(community);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/join')
  @ApiParam({ name: 'conversationId', example: 1 })
  async join(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.joinCommunity(
        req.user.id,
        conversationId,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/leave')
  @ApiParam({ name: 'conversationId', example: 1 })
  async leave(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      await this.chatService.leaveCommunity(req.user.id, conversationId);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/:conversationId/requests')
  @ApiParam({ name: 'conversationId', example: 1 })
  async requests(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const pending = await this.chatService.listPendingRequests(
        req.user.id,
        conversationId,
      );
      return res.status(HttpStatus.OK).json(pending);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/requests/:userId/approve')
  @ApiParam({ name: 'conversationId', example: 1 })
  @ApiParam({ name: 'userId', example: 2 })
  async approve(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      await this.chatService.reviewRequest(
        req.user.id,
        conversationId,
        targetUserId,
        true,
      );
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/requests/:userId/reject')
  @ApiParam({ name: 'conversationId', example: 1 })
  @ApiParam({ name: 'userId', example: 2 })
  async reject(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      await this.chatService.reviewRequest(
        req.user.id,
        conversationId,
        targetUserId,
        false,
      );
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/direct/:userId')
  @ApiParam({ name: 'userId', example: 2 })
  async direct(
    @Param('userId', ParseIntPipe) otherUserId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const conversation = await this.chatService.getOrCreateDirect(
        req.user.id,
        otherUserId,
      );
      return res.status(HttpStatus.OK).json(conversation);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/:conversationId')
  @ApiParam({ name: 'conversationId', example: 1 })
  async details(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const details = await this.chatService.getDetails(
        req.user.id,
        conversationId,
      );
      return res.status(HttpStatus.OK).json(details);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/mute')
  @ApiParam({ name: 'conversationId', example: 1 })
  @ApiBody({ type: SetMutedDTO })
  async mute(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() body: SetMutedDTO,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      await this.chatService.setMuted(req.user.id, conversationId, body.muted);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/:conversationId/messages')
  @ApiParam({ name: 'conversationId', example: 1 })
  @ApiQuery({ name: 'before', required: false, example: 120 })
  @ApiQuery({ name: 'limit', required: false, example: 30 })
  async messages(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query('before') before: string | undefined,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const messages = await this.chatService.listMessages(
        req.user.id,
        conversationId,
        before ? Number(before) : undefined,
        limit,
      );
      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/messages')
  @ApiParam({ name: 'conversationId', example: 1 })
  @ApiBody({ type: SendMessageDTO })
  async send(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() body: SendMessageDTO,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      const message = await this.chatService.sendMessage(
        req.user.id,
        conversationId,
        body.content,
      );
      return res.status(HttpStatus.CREATED).json(message);
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:conversationId/read')
  @ApiParam({ name: 'conversationId', example: 1 })
  async read(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Req() req: { user: { id: number } },
    @Res() res: Response,
  ) {
    try {
      await this.chatService.markRead(req.user.id, conversationId);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
