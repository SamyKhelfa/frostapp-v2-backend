-- CreateEnum
CREATE TYPE "JoinPolicy" AS ENUM ('OPEN', 'APPROVAL');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "joinPolicy" "JoinPolicy" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "status" "ParticipantStatus" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
