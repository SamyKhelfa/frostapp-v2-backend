import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetUserActiveDTO {
  @ApiProperty({ description: 'Active user account', example: true })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
