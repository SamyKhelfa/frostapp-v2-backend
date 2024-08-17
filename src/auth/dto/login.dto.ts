import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty({
        description: "The email of the user.",
        example: 'test@gmail.com',
        uniqueItems: true
    })
    readonly email: string;

    @ApiProperty({
        description: "The password of the user.",
        example: 'test1234'
    })
    readonly password: string;
}
