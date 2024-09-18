import { ApiProperty } from "@nestjs/swagger";

export class LessonDTO {
    @ApiProperty({
        description : "Title of Lesson",
        example: "How to take cold shower ?"
    })

    title: string

    @ApiProperty({
        description: "Description of Lesson",
        example:""
    })

    description: string

    @ApiProperty({
        description: "Array of user IDs associated with this lesson",
        example: [1, 2, 3],
        required: false
    })
    userIds?: number[]

    // @ApiProperty({
    //     description: "Array of chapters associated with this lesson",
    //     example: [1, 2, 3],
    // })



}