import { ApiProperty } from "@nestjs/swagger";

export class LessonDTO {
    @ApiProperty({
        title : "Title of Lesson",
        description : "Description of Lesson",
        
    })
}