-- CreateTable
CREATE TABLE "ColdShowerEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "feeling" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColdShowerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ColdShowerEntry_userId_date_idx" ON "ColdShowerEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ColdShowerEntry_userId_date_key" ON "ColdShowerEntry"("userId", "date");

-- AddForeignKey
ALTER TABLE "ColdShowerEntry" ADD CONSTRAINT "ColdShowerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
