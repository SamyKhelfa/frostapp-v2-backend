import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDTO {
  @ApiProperty({ example: 'Douche de 3 minutes ce matin, ça pique !' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
