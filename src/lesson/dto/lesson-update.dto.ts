import { ApiProperty } from "@nestjs/swagger";

export class LessonUpdateDTO {
    @ApiProperty({
        description : "Title of Lesson",
        example: "How to take cold shower ?"
    })
    title: string

    @ApiProperty({
        description: "Description of Lesson",
        example: "Taking a cold shower can be invigorating and beneficial to your health if done correctly"
    })
    description: string

    @ApiProperty({
        description: "Array of user IDs associated with this lesson",
        example: [1, 2, 3],
        required: false
    })
    users?: number[]

    @ApiProperty({
        description: "Array of chapters associated with this lesson",
        example: [1, 2, 3],
        required: false

    })
    chapters?: number[];
}