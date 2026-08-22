import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetMutedDTO {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  muted: boolean;
}
