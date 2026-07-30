import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/** Mise à jour partielle : tout champ absent est laissé tel quel. */
export class ChapterUpdateDTO {
  @ApiPropertyOptional({
    description: 'Title of chapter',
    example: 'Cold shower: first etape',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of chapter',
    example: 'In this chapter we will see how to take a cold shower',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Image of chapter',
    example: 'Bathroom photo',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Status of chapter',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Position of chapter in the lesson',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;
}
