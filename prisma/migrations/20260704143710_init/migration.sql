-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('WATCHLIST', 'FAVORITE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('movie', 'tv');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listType" "ListType" NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,
    "voteAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "releaseYear" INTEGER,
    "note" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ListItem_userId_listType_idx" ON "ListItem"("userId", "listType");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_userId_listType_mediaType_tmdbId_key" ON "ListItem"("userId", "listType", "mediaType", "tmdbId");

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
