import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * Arborescence complète d'un cours en une seule requête.
 *
 * Vocabulaire côté admin -> modèle :
 *   cours = Lesson, leçon = Chapter, chapitre = SubChapter.
 */

export class SubChapterNestedDTO {
  @ApiProperty({
    description: 'Title of the subchapter',
    example: 'Go to the bathroom',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the subchapter',
    example: 'How to start a cold shower',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Video URL of the subchapter',
    example: 'https://cdn.example.com/cold-shower.mp4',
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({
    description: 'Duration of the video, in minutes',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Whether the subchapter is published',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the subchapter is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Position within the chapter, defaults to the payload order',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;
}

export class ChapterNestedDTO {
  @ApiProperty({
    description: 'Title of the chapter',
    example: 'Cold shower: first step',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the chapter',
    example: 'In this chapter we will see how to take a cold shower',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Image of the chapter',
    example: 'https://cdn.example.com/bathroom.png',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Whether the chapter is published',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Position within the lesson, defaults to the payload order',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @ApiPropertyOptional({
    description: 'Subchapters to create along with this chapter',
    type: [SubChapterNestedDTO],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubChapterNestedDTO)
  subChapters?: SubChapterNestedDTO[];
}

export class LessonCreateFullDTO {
  @ApiProperty({
    description: 'Title of the lesson',
    example: 'How to take a cold shower?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the lesson',
    example: 'Taking a cold shower can be invigorating',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Array of user IDs associated with this lesson',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  users?: number[];

  @ApiPropertyOptional({
    description: 'Chapters to create along with this lesson',
    type: [ChapterNestedDTO],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterNestedDTO)
  chapters?: ChapterNestedDTO[];
}
