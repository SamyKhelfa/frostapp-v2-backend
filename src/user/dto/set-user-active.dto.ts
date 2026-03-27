import { ApiProperty } from '@nestjs/swagger';

export class SetUserActiveDTO {
  @ApiProperty({ description: 'Active user account', example: true })
  active: boolean;
}
