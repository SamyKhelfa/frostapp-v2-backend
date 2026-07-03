import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({
    description: "Email de l'utilisateur qui demande la réinitialisation.",
    example: 'user@frost.fr',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
