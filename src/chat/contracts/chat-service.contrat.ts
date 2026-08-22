import { Conversation, Message } from '@prisma/client';
import { CreateCommunityDTO } from '../dto';

export const CHAT_SERVICE_TOKEN = 'CHAT_SERVICE';

export interface ChatServiceContract {
  getCommunity(userId: number): Promise<Conversation>;
  listCommunities(userId: number): Promise<unknown[]>;
  getDetails(userId: number, conversationId: number): Promise<unknown>;
  setMuted(
    userId: number,
    conversationId: number,
    muted: boolean,
  ): Promise<void>;
  createCommunity(
    userId: number,
    dto: CreateCommunityDTO,
  ): Promise<Conversation>;
  joinCommunity(
    userId: number,
    conversationId: number,
  ): Promise<{ status: string }>;
  leaveCommunity(userId: number, conversationId: number): Promise<void>;
  listPendingRequests(
    userId: number,
    conversationId: number,
  ): Promise<unknown[]>;
  reviewRequest(
    userId: number,
    conversationId: number,
    targetUserId: number,
    approve: boolean,
  ): Promise<void>;
  getOrCreateDirect(userId: number, otherUserId: number): Promise<Conversation>;
  listForUser(userId: number): Promise<unknown[]>;
  listMessages(
    userId: number,
    conversationId: number,
    before?: number,
    limit?: number,
  ): Promise<Message[]>;
  sendMessage(
    userId: number,
    conversationId: number,
    content: string,
  ): Promise<Message>;
  markRead(userId: number, conversationId: number): Promise<void>;
}
