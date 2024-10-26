-- CreateTable
CREATE TABLE "SubChapter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "position" INTEGER NOT NULL,
    "chapterId" INTEGER,

    CONSTRAINT "SubChapter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubChapter" ADD CONSTRAINT "SubChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
