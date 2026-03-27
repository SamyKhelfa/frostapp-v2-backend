import { Module, Global } from '@nestjs/common';
import { IsAuthenticatedGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, IsAuthenticatedGuard, RolesGuard],
  exports: [UserService],
})
export class UserModule {}
