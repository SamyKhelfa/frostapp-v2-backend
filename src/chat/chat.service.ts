import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  Conversation,
  ConversationType,
  JoinPolicy,
  Message,
  ParticipantRole,
  ParticipantStatus,
} from '@prisma/client';
import { CreateCommunityDTO } from './dto';
import { NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { ChatServiceContract } from './contracts';

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

const authorSelect = {
  select: { id: true, name: true, avatar: true },
};

@Injectable()
export class ChatService implements ChatServiceContract {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
    private notifications: NotificationService,
  ) {}

  private buildPairKey(a: number, b: number): string {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
  }

  private async assertAccess(
    userId: number,
    conversationId: number,
  ): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
    }

    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant || participant.status !== ParticipantStatus.ACTIVE) {
      throw new HttpException(
        'You are not part of this conversation',
        HttpStatus.FORBIDDEN,
      );
    }

    return conversation;
  }

  private async assertAdmin(userId: number, conversationId: number) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    const isAdmin =
      participant &&
      participant.status === ParticipantStatus.ACTIVE &&
      (participant.role === ParticipantRole.OWNER ||
        participant.role === ParticipantRole.ADMIN);

    if (!isAdmin) {
      throw new HttpException(
        'Admin rights required',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async joinIfNeeded(userId: number, conversationId: number) {
    await this.prisma.conversationParticipant.upsert({
      where: { conversationId_userId: { conversationId, userId } },
      create: { conversationId, userId },
      update: {},
    });
  }

  async getCommunity(userId: number): Promise<Conversation> {
    const existing = await this.prisma.conversation.findFirst({
      where: { type: ConversationType.COMMUNITY },
      orderBy: { id: 'asc' },
    });

    const conversation =
      existing ??
      (await this.prisma.conversation.create({
        data: {
          type: ConversationType.COMMUNITY,
          name: 'Le salon',
          joinPolicy: JoinPolicy.OPEN,
        },
      }));

    if (conversation.joinPolicy === JoinPolicy.OPEN) {
      await this.joinIfNeeded(userId, conversation.id);
    } else {
      await this.assertAccess(userId, conversation.id);
    }

    return conversation;
  }

  async getDetails(userId: number, conversationId: number) {
    await this.assertAccess(userId, conversationId);

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
          include: { user: authorSelect },
        },
      },
    });

    const me = conversation.participants.find((p) => p.userId === userId);

    const isAdmin =
      me?.role === ParticipantRole.OWNER || me?.role === ParticipantRole.ADMIN;

    const members = conversation.participants.filter(
      (p) => p.status === ParticipantStatus.ACTIVE,
    );

    const pending = conversation.participants.filter(
      (p) => p.status === ParticipantStatus.PENDING,
    );

    return {
      id: conversation.id,
      type: conversation.type,
      name: conversation.name,
      description: conversation.description,
      image: conversation.image,
      joinPolicy: conversation.joinPolicy,
      createdAt: conversation.createdAt,
      members: members.map((p) => ({
        userId: p.userId,
        role: p.role,
        joinedAt: p.joinedAt,
        user: p.user,
      })),
      memberCount: members.length,
      pendingCount: isAdmin ? pending.length : 0,
      me: {
        role: me?.role ?? ParticipantRole.MEMBER,
        muted: me?.muted ?? false,
        isAdmin,
        isOwner: me?.role === ParticipantRole.OWNER,
      },
    };
  }

  async setMuted(
    userId: number,
    conversationId: number,
    muted: boolean,
  ): Promise<void> {
    await this.assertAccess(userId, conversationId);

    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { muted },
    });
  }

  async listCommunities(userId: number) {
    const communities = await this.prisma.conversation.findMany({
      where: { type: ConversationType.COMMUNITY },
      orderBy: { updatedAt: 'desc' },
      include: {
        participants: { select: { userId: true, status: true, role: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { author: authorSelect },
        },
      },
    });

    return communities.map((community) => {
      const me = community.participants.find((p) => p.userId === userId);

      const isAdmin =
        me?.status === ParticipantStatus.ACTIVE &&
        (me.role === ParticipantRole.OWNER ||
          me.role === ParticipantRole.ADMIN);

      return {
        id: community.id,
        name: community.name,
        description: community.description,
        image: community.image,
        joinPolicy: community.joinPolicy,
        updatedAt: community.updatedAt,
        memberCount: community.participants.filter(
          (p) => p.status === ParticipantStatus.ACTIVE,
        ).length,
        lastMessage: community.messages[0] ?? null,
        membership: me ? me.status : null,
        role: me ? me.role : null,
        pendingCount: isAdmin
          ? community.participants.filter(
              (p) => p.status === ParticipantStatus.PENDING,
            ).length
          : 0,
      };
    });
  }

  async createCommunity(
    userId: number,
    dto: CreateCommunityDTO,
  ): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        type: ConversationType.COMMUNITY,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        joinPolicy: dto.joinPolicy ?? JoinPolicy.OPEN,
        createdById: userId,
        participants: {
          create: [
            {
              userId,
              role: ParticipantRole.OWNER,
              status: ParticipantStatus.ACTIVE,
            },
          ],
        },
      },
    });
  }

  async joinCommunity(userId: number, conversationId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.type !== ConversationType.COMMUNITY) {
      throw new HttpException('Community not found', HttpStatus.NOT_FOUND);
    }

    const existing = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (existing) {
      return { status: existing.status };
    }

    const status =
      conversation.joinPolicy === JoinPolicy.OPEN
        ? ParticipantStatus.ACTIVE
        : ParticipantStatus.PENDING;

    await this.prisma.conversationParticipant.create({
      data: { conversationId, userId, status },
    });

    if (status === ParticipantStatus.PENDING) {
      const admins = await this.prisma.conversationParticipant.findMany({
        where: {
          conversationId,
          status: ParticipantStatus.ACTIVE,
          role: { in: [ParticipantRole.OWNER, ParticipantRole.ADMIN] },
        },
        select: { userId: true },
      });

      await this.notifications.notifyMany(
        admins.map((admin) => admin.userId),
        {
          type: NotificationType.JOIN_REQUEST,
          actorId: userId,
          conversationId,
        },
      );
    }

    return { status };
  }

  async leaveCommunity(userId: number, conversationId: number): Promise<void> {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) return;

    if (participant.role === ParticipantRole.OWNER) {
      throw new HttpException(
        'The owner cannot leave their own community',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.conversationParticipant.delete({
      where: { conversationId_userId: { conversationId, userId } },
    });
  }

  async listPendingRequests(userId: number, conversationId: number) {
    await this.assertAdmin(userId, conversationId);

    return this.prisma.conversationParticipant.findMany({
      where: { conversationId, status: ParticipantStatus.PENDING },
      orderBy: { joinedAt: 'asc' },
      include: { user: authorSelect },
    });
  }

  async reviewRequest(
    userId: number,
    conversationId: number,
    targetUserId: number,
    approve: boolean,
  ): Promise<void> {
    await this.assertAdmin(userId, conversationId);

    const pending = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId: targetUserId },
      },
    });

    if (!pending || pending.status !== ParticipantStatus.PENDING) {
      throw new HttpException('No pending request', HttpStatus.NOT_FOUND);
    }

    if (approve) {
      await this.prisma.conversationParticipant.update({
        where: {
          conversationId_userId: { conversationId, userId: targetUserId },
        },
        data: { status: ParticipantStatus.ACTIVE },
      });

      await this.notifications.notify({
        userId: targetUserId,
        type: NotificationType.JOIN_APPROVED,
        actorId: userId,
        conversationId,
      });

      return;
    }

    await this.prisma.conversationParticipant.delete({
      where: {
        conversationId_userId: { conversationId, userId: targetUserId },
      },
    });
  }

  async getOrCreateDirect(
    userId: number,
    otherUserId: number,
  ): Promise<Conversation> {
    if (userId === otherUserId) {
      throw new HttpException(
        'Cannot start a conversation with yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const other = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!other || !other.active) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const pairKey = this.buildPairKey(userId, otherUserId);

    const existing = await this.prisma.conversation.findUnique({
      where: { pairKey },
    });

    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        pairKey,
        participants: {
          create: [{ userId }, { userId: otherUserId }],
        },
      },
    });
  }

  async listForUser(userId: number) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId, status: ParticipantStatus.ACTIVE },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        participants: { include: { user: authorSelect } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { author: authorSelect },
        },
      },
    });

    return Promise.all(
      conversations.map(async (conversation) => {
        const me = conversation.participants.find(
          (participant) => participant.userId === userId,
        );

        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conversation.id,
            authorId: { not: userId },
            ...(me?.lastReadAt ? { createdAt: { gt: me.lastReadAt } } : {}),
          },
        });

        return {
          id: conversation.id,
          type: conversation.type,
          updatedAt: conversation.updatedAt,
          lastMessage: conversation.messages[0] ?? null,
          participants: conversation.participants.map((p) => p.user),
          unreadCount,
        };
      }),
    );
  }

  async listMessages(
    userId: number,
    conversationId: number,
    before?: number,
    limit = DEFAULT_PAGE_SIZE,
  ): Promise<Message[]> {
    await this.assertAccess(userId, conversationId);

    const take = Math.min(Math.max(limit, 1), MAX_PAGE_SIZE);

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(before ? { id: { lt: before } } : {}),
      },
      orderBy: { id: 'desc' },
      take,
      include: { author: authorSelect },
    });

    return messages.reverse();
  }

  async sendMessage(
    userId: number,
    conversationId: number,
    content: string,
  ): Promise<Message> {
    await this.assertAccess(userId, conversationId);

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: { conversationId, authorId: userId, content: content.trim() },
        include: { author: authorSelect },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  async markRead(userId: number, conversationId: number): Promise<void> {
    await this.assertAccess(userId, conversationId);

    await this.prisma.conversationParticipant.upsert({
      where: { conversationId_userId: { conversationId, userId } },
      create: { conversationId, userId, lastReadAt: new Date() },
      update: { lastReadAt: new Date() },
    });
  }
}
