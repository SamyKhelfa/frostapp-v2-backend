import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoinPolicy } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommunityDTO {
  @ApiProperty({ example: 'Défi 30 jours' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({ example: 'Une douche froide par jour pendant un mois' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({ enum: JoinPolicy, example: JoinPolicy.OPEN })
  @IsOptional()
  @IsEnum(JoinPolicy)
  joinPolicy?: JoinPolicy;
}
