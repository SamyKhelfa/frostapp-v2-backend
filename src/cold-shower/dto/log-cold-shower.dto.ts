import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class LogColdShowerDTO {
  @ApiPropertyOptional({
    description: 'Jour concerne au format AAAA-MM-JJ. Par defaut, aujourd hui.',
    example: '2026-08-22',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date doit etre au format AAAA-MM-JJ',
  })
  date?: string;

  @ApiProperty({ description: 'Ressenti de 1 a 5', example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  feeling: number;

  @ApiPropertyOptional({ example: 'Trois minutes, ca pique mais ca reveille' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
