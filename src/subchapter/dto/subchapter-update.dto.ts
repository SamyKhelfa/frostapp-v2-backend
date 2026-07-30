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
export class SubChapterUpdateDTO {
  @ApiPropertyOptional({
    description: 'title of the subchapter',
    example: 'Cold shower : Go to the bathrooms',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of subchapter',
    example: 'In this subchapter we will see how to start cold shower',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Video of subchapter',
    example: 'Video of how taking cold shower',
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({
    description: 'Position of subchapter in the chapter',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @ApiPropertyOptional({
    description: 'The duration of the video',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Status of subchapter',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Active status of subchapter',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'ID of the chapter this subchapter belongs to',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  chapterId?: number;
}
