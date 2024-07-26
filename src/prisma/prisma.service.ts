import {
    INestApplication,
    Injectable,
    Logger,
    OnModuleInit,
  } from '@nestjs/common';
  import { Prisma, PrismaClient } from '@prisma/client';
  
  const SOFT_DELETE_MODELS: readonly string[] = [];
  
  @Injectable()
  export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);
  
    constructor() {
      super({
        log: ['warn', 'error'],
      });
  
      this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$on('query', (e) => this.logger.debug(`${e.query} ${e.params}`));
  
      this.$use(async (params, next) => {
        if (SOFT_DELETE_MODELS.includes(params.model)) {
          if (params.action === 'findUnique' || params.action === 'findFirst') {
            params.action = 'findFirst';
            params.args.where['deletedAt'] = null;
          }
  
          if (params.action === 'findMany') {
            if (params.args.where) {
              if (params.args.where.deletedAt == undefined) {
                params.args.where['deletedAt'] = null;
              }
            } else {
              params.args['where'] = { deletedAt: null };
            }
          }
        }
        return next(params);
      });
  
      this.$use(async (params, next) => {
        if (SOFT_DELETE_MODELS.includes(params.model)) {
          if (params.action == 'update') {
            params.action = 'updateMany';
            params.args.where['deletedAt'] = null;
          }
  
          if (params.action == 'updateMany') {
            if (params.args.where != undefined) {
              params.args.where['deletedAt'] = null;
            } else {
              params.args['where'] = { deletedAt: null };
            }
          }
        }
        return next(params);
      });
  
      this.$use(async (params, next) => {
        if (SOFT_DELETE_MODELS.includes(params.model)) {
          if (params.action == 'delete') {
            params.action = 'update';
            params.args['data'] = { deletedAt: new Date() };
          }
  
          if (params.action == 'deleteMany') {
            params.action = 'updateMany';
            if (params.args.data != undefined) {
              params.args.data['deletedAt'] = new Date();
            } else {
              params.args['data'] = { deletedAt: new Date() };
            }
          }
        }
        return next(params);
      });
    }
  
    async onModuleInit(): Promise<void> {
      await this.$connect();
    }
  
    async enableShutdownHooks(app: INestApplication): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$on('beforeExit', async () => {
        await app.close();
      });
    }
  }
  