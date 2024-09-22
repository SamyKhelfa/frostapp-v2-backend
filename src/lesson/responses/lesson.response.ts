import { ApiProperty } from "@nestjs/swagger";
import { Chapter } from '@prisma/client'

export class LessonResponse {
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
        example: [],
        required: false
    })
    users?: {
        id: number,
        name: string
    }[]

    @ApiProperty({
        description: "Array of chapters associated with this lesson",
        example: [],
        required: false
    })
    chapters?: Chapter[];

    @ApiProperty({
        description:'Creation timestamp'
    })
    createdAt: Date

    @ApiProperty({
        description:'Last update timestamp'
    })
    updatedAt: Date
}