import { ApiProperty } from "@nestjs/swagger";

export class LessonFindByIdDTO {
    @ApiProperty({
        description:"Id of Lesson",
        example:"123456"
    })
    readonly lessonId: string
}