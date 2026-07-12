/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "estimatedHours" INTEGER,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'id',
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referralCode" TEXT;

-- CreateTable
CREATE TABLE "DiscussionLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussionLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT NOT NULL DEFAULT 'beginner',
    "iconUrl" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathCourse" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "LearningPathCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "reward" INTEGER NOT NULL DEFAULT 0,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseShare" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'link',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscussionLike_userId_discussionId_key" ON "DiscussionLike"("userId", "discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPathCourse_learningPathId_courseId_key" ON "LearningPathCourse"("learningPathId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredId_key" ON "Referral"("referredId");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionLike" ADD CONSTRAINT "DiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathCourse" ADD CONSTRAINT "LearningPathCourse_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathCourse" ADD CONSTRAINT "LearningPathCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
