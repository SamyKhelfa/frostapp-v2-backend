import { SetMetadata } from '@nestjs/common';
import { UserRolesEnum } from '@prisma/client';

export const Roles = (...roles: UserRolesEnum[]) => SetMetadata('roles', roles);
