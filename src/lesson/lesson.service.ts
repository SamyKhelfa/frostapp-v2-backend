import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LessonCreateDTO } from "./dto";
import { getConnectIds } from "../utils";
import { Lesson } from "@prisma/client";
import { LessonUpdateDTO } from "./dto/lesson-update.dto";

@Injectable()
export class LessonService {
    constructor(
        @Inject(PrismaService)
        private prisma: PrismaService
    ){}

    private includeData = {
        chapters: true,
        users: {
            select: {
                id: true,
                name: true
            }
        }
    }

    async findAll(): Promise<Lesson[]> {
        return this.prisma.lesson.findMany({
            include: this.includeData,
        })
    }

    async findById(id: number) : Promise<Lesson> {
        return this.prisma.lesson.findUnique({
            where: {
                id
            },
            include: this.includeData,
        })
    }

    async update(id: number, dto: LessonUpdateDTO) : Promise<Lesson> {
        const { title, description, chapters } = dto;

        return this.prisma.lesson.update({
            where:{id},
            include: this.includeData,
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
            include: this.includeData,
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

    async delete(id: number): Promise<void> {
        await this.prisma.lesson.delete({
            where:{id},
        })
    }
}
