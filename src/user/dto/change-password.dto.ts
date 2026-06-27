import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({
    description: "Mot de passe actuel pour confirmer l'identité",
    example: 'Test1234!',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'Nouveau mot de passe (8 caractères minimum)',
    example: 'NewSecret123!',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
