import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMeDTO {
  @ApiProperty({
    description: 'Nouveau nom',
    example: 'Maxime Givré',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    description: 'Nouvel email',
    example: 'maxime@frost.fr',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'URL de la photo de profil',
    example: 'https://cdn.frost.fr/avatars/maxime.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
