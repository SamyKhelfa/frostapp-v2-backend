import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findUserById(userId: number): Promise<User | null> {
    if (!userId) {
      return null;
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
