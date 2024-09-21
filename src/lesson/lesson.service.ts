import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LessonCreateDTO } from "./dto";
import { LessonResponse } from "./responses";
import { getConnectIds } from "../utils";
@Injectable()
export class LessonService {
    constructor(
        @Inject(PrismaService)
        private prisma: PrismaService
    ){}

    // replace any by response type
    async findAll(): Promise<any> {
        return this.prisma.lesson.findMany({
            include: {
                chapters: true,
                users: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }


    async create(dto: LessonCreateDTO) : Promise<LessonResponse> {
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
}