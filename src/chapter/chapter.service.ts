import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ChapterCreateDTO } from "./dto/chapter-create.dto";
import { getConnectIds } from "src/utils";
import { Chapter } from "@prisma/client";
import { ChapterUpdateDTO } from "./dto/chapter-update.dto";

@Injectable()
export class ChapterService {
    constructor(private prisma: PrismaService) {}

    private includeData = {
        Lesson: {
            select: {
                id: true,
                title: true
            }
        }
    }

    async findAll(): Promise<Chapter[]>{    
        return this.prisma.chapter.findMany()
}


async findOne(id: number): Promise<Chapter> {
    return this.prisma.chapter.findUnique({
        where: {id},
    })
}

async create(dto: ChapterCreateDTO) : Promise<Chapter>{
    const {title, description, image, status, position, lessonId} = dto

    return this.prisma.chapter.create({
        data:{
            title,
            description,
            image,
            status,
            position,
            Lesson: lessonId ? { connect:{id: lessonId}} : undefined
        },
        include: this.includeData
    })
}

async update(id:number, dto: ChapterUpdateDTO) : Promise<Chapter> {
    const {title, description, image, status, position} = dto

    return this.prisma.chapter.update({
        where:{id},
        include: this.includeData,
        data:{
            title,
            description,
            image,
            status,
            position
        }
    })
 
}

async delete(id: number): Promise<void>{
    await this.prisma.chapter.delete({
        where:{id},
    })
}

}