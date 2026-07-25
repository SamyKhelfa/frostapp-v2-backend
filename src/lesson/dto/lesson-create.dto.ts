import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LessonCreateDTO {
  @ApiProperty({
    description: 'Title of Lesson',
    example: 'How to take cold shower ?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of Lesson',
    example:
      'Taking a cold shower can be invigorating and beneficial to your health if done correctly',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Array of user IDs associated with this lesson',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  users?: number[];

  @ApiProperty({
    description: 'Array of chapters associated with this lesson',
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  chapters?: number[];
}