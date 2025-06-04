-- CreateEnum
CREATE TYPE "Rare" AS ENUM ('SSR', 'SR');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SENTINEL', 'VANGUARD', 'SUPPORT', 'BULWARK');

-- CreateEnum
CREATE TYPE "Attribute" AS ENUM ('LIGHT_AMMO', 'MEDIUM_AMMO', 'HEAVY_AMMO', 'SHOTGUN_AMMO', 'MELEE', 'BURN', 'CORROSION', 'HYDRO', 'FREEZE', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "NeuralHelixType" AS ENUM ('COMMON', 'COMMON_LOVE', 'EXTENSION', 'UNIQUE_201', 'UNIQUE_203', 'UNIQUE_401', 'UNIQUE_403', 'UNIQUE_601', 'UNIQUE_603');

-- CreateEnum
CREATE TYPE "ReleaseCountry" AS ENUM ('CN', 'KO');

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "attack" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "health" INTEGER NOT NULL DEFAULT 0,
    "stability" INTEGER NOT NULL DEFAULT 0,
    "criticalRate" INTEGER NOT NULL DEFAULT 0,
    "criticalDamage" INTEGER NOT NULL DEFAULT 0,
    "attackBonus" INTEGER NOT NULL DEFAULT 0,
    "defenseBonus" INTEGER NOT NULL DEFAULT 0,
    "healthBonus" INTEGER NOT NULL DEFAULT 0,
    "mobility" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusBonus" (
    "id" SERIAL NOT NULL,
    "attackBonus" INTEGER NOT NULL DEFAULT 0,
    "defenseBonus" INTEGER NOT NULL DEFAULT 0,
    "healthBonus" INTEGER NOT NULL DEFAULT 0,
    "criticalRate" INTEGER NOT NULL DEFAULT 0,
    "criticalDamage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StatusBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeuralHelixKey" (
    "type" "NeuralHelixType" NOT NULL,
    "isCommon" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dollId" INTEGER NOT NULL,
    "statusBonusId" INTEGER,

    CONSTRAINT "NeuralHelixKey_pkey" PRIMARY KEY ("dollId","type")
);

-- CreateTable
CREATE TABLE "Doll" (
    "id" SERIAL NOT NULL,
    "ko_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "rare" "Rare" NOT NULL,
    "affinities" "Attribute"[],
    "weaknesses" "Attribute"[],
    "release" "ReleaseCountry"[],
    "statusId" INTEGER NOT NULL,
    "opinionId" INTEGER NOT NULL,

    CONSTRAINT "Doll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opinion" (
    "id" SERIAL NOT NULL,
    "upvote" INTEGER NOT NULL,
    "downvote" INTEGER NOT NULL,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "opinionId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NeuralHelixKey_statusBonusId_key" ON "NeuralHelixKey"("statusBonusId");

-- CreateIndex
CREATE UNIQUE INDEX "Doll_statusId_key" ON "Doll"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "Doll_opinionId_key" ON "Doll"("opinionId");

-- AddForeignKey
ALTER TABLE "NeuralHelixKey" ADD CONSTRAINT "NeuralHelixKey_dollId_fkey" FOREIGN KEY ("dollId") REFERENCES "Doll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeuralHelixKey" ADD CONSTRAINT "NeuralHelixKey_statusBonusId_fkey" FOREIGN KEY ("statusBonusId") REFERENCES "StatusBonus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doll" ADD CONSTRAINT "Doll_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doll" ADD CONSTRAINT "Doll_opinionId_fkey" FOREIGN KEY ("opinionId") REFERENCES "Opinion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_opinionId_fkey" FOREIGN KEY ("opinionId") REFERENCES "Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
