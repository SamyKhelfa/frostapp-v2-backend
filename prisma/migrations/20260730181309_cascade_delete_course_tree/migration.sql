-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "SubChapter" DROP CONSTRAINT "SubChapter_chapterId_fkey";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubChapter" ADD CONSTRAINT "SubChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
