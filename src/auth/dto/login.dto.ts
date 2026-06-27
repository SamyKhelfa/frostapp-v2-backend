import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'The email of the user.',
    example: 'test@gmail.com',
    uniqueItems: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'test1234',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
