import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SubChapterCreateDTO {
  @ApiProperty({
    description: 'title of the subchapter',
    example: 'Cold shower : Go to the bathrooms',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of subchapter',
    example: 'In this subchapter we will see how to start cold shower',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Video of subchapter',
    example: 'Video of how taking cold shower',
  })
  @IsString()
  video: string;

  @ApiProperty({
    description: 'Position of subchapter in the chapter',
    example: 1,
  })
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty({
    description: 'Status of subchapter',
    example: true,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: 'Active status of subchapter',
    example: true,
  })
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional({
    description: 'ID of the chapter this subchapter belongs to',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  chapterId?: number;

  @ApiProperty({
    description: 'The duration of the video',
    example: 1,
  })
  @IsInt()
  @Min(0)
  duration: number;
}
