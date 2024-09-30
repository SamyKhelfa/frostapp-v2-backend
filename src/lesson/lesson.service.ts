import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LessonCreateDTO } from "./dto";
import { getConnectIds } from "../utils";
import { Lesson } from "@prisma/client";
import { LessonFindByIdDTO } from "./dto/lesson-find-by-id";
import { LessonUpdateDTO } from "./dto/lesson-update.dto";
import { LessonDeleteDTO } from "./dto/lesson-delete.dto";

@Injectable()
export class LessonService {
    constructor(
        @Inject(PrismaService)
        private prisma: PrismaService
    ){}

    async findAll(): Promise<Lesson[]> {
        return this.prisma.lesson.findMany({
            include: {
                chapters: true,
                users: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
        })
    }

    async findById(dto: LessonFindByIdDTO) : Promise<Lesson> {
        return this.prisma.lesson.findUnique({
            where:{
                id: Number(dto.lessonId)
            }
        })
    }

    async update(id: number, dto: LessonUpdateDTO) : Promise<Lesson> {
        const { title, description, chapters } = dto;

        return this.prisma.lesson.update({
            where:{id},
            data: {
                title,
                description,
                chapters: {
                    connect: getConnectIds(chapters)
                }
            }
        })
    }
    



    async create(dto: LessonCreateDTO) : Promise<Lesson> {
        const { title, description, users, chapters } = dto

        return this.prisma.lesson.create({
            include: {
                chapters: true,
                users: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            data: {
                title,
                description,
                users: {
                    connect: getConnectIds(users)
                },
                chapters: {
                    connect: getConnectIds(chapters)
                }
            }
        })
    }

    async delete(id: number, dto: LessonDeleteDTO): Promise<Lesson> {
        const { title, description, chapters } = dto;

        return this.prisma.lesson.update({
            where:{id},
            data: {
                title,
                description,
                chapters: {
                    connect: getConnectIds(chapters)
                }
            }
        })
    }


}




 