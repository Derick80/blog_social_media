/*
  Warnings:

  - You are about to drop the column `birthDay` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLike` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_userId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "birthDay";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "CommentLike";

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postImg" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MiniPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToMiniPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_id_key" ON "Avatar"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userId_key" ON "Avatar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MiniPost_id_key" ON "MiniPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMiniPost_AB_unique" ON "_CategoryToMiniPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMiniPost_B_index" ON "_CategoryToMiniPost"("B");

-- CreateIndex
CREATE INDEX "Post_id_userId_idx" ON "Post"("id", "userId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniPost" ADD CONSTRAINT "MiniPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMiniPost" ADD CONSTRAINT "_CategoryToMiniPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMiniPost" ADD CONSTRAINT "_CategoryToMiniPost_B_fkey" FOREIGN KEY ("B") REFERENCES "MiniPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
