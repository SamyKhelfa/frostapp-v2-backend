import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    description: 'The email of the user.',
    example: 'test@gmail.com',
    uniqueItems: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'The name of the user.',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly name: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'test1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
