import { ApiProperty } from "@nestjs/swagger";

export class ChapterUpdateDTO {
    @ApiProperty({
        description: "Title of chapter",
        example: "Cold shower: first etape"
    })
    title: string;

    @ApiProperty({
        description: "Description of chapter",
        example: "In this chapter we will see how to take a cold shower"
    })
    description: string;

    @ApiProperty({
        description: "Image of chapter",
        example: "Bathroom photo"
    })
    image: string;

    @ApiProperty({
        description: "Status of chapter",
        example: true
    })
    status: boolean;

    @ApiProperty({
        description: "Position of chapter in the lesson",
        example: 1
    })
    position: number;

    @ApiProperty({
        description: "ID of the lesson this chapter belongs to",
        example: 1
    })
    lessonId: number;
}