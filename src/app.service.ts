import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
