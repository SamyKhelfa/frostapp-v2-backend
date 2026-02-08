import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { USER_SERVICE_TOKEN } from './contracts';

@Global()
@Module({
  controllers: [],
  providers: [{ provide: USER_SERVICE_TOKEN, useClass: UserService }],
  exports: [USER_SERVICE_TOKEN],
})
export class UserModule {}
