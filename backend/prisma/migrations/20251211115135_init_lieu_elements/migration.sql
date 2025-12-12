-- CreateEnum
CREATE TYPE "ElementType" AS ENUM ('niveau', 'espace');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lieu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Lieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Element" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ElementType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lieuId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Lieu_userId_idx" ON "Lieu"("userId");

-- CreateIndex
CREATE INDEX "Element_lieuId_idx" ON "Element"("lieuId");

-- CreateIndex
CREATE INDEX "Element_parentId_idx" ON "Element"("parentId");

-- AddForeignKey
ALTER TABLE "Lieu" ADD CONSTRAINT "Lieu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Element"("id") ON DELETE SET NULL ON UPDATE CASCADE;
