import { Module } from "@nestjs/common";
import { LessonsController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

@Module({
    controllers: [LessonsController],
    providers:[LessonService]
})
export class LessonModule {}