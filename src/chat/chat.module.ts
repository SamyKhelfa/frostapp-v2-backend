import { Module } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../guards';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CHAT_SERVICE_TOKEN } from './contracts';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    IsAuthenticatedGuard,
    { provide: CHAT_SERVICE_TOKEN, useClass: ChatService },
  ],
})
export class ChatModule {}
