import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChapterCreateDTO {
  @ApiProperty({
    description: 'Title of chapter',
    example: 'Cold shower: first etape',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of chapter',
    example: 'In this chapter we will see how to take a cold shower',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Image of chapter',
    example: 'Bathroom photo',
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Status of chapter',
    example: true,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: 'Position of chapter in the lesson',
    example: 1,
  })
  @IsInt()
  position: number;

  @ApiProperty({
    description: 'ID of the lesson this chapter belongs to',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  lessonId?: number;
}
