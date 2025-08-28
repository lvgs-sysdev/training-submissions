/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,property_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,property_id]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `property_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_id` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_userId_fkey";

-- DropIndex
DROP INDEX "public"."Favorite_userId_propertyId_key";

-- DropIndex
DROP INDEX "public"."Inquiry_userId_propertyId_key";

-- AlterTable
ALTER TABLE "public"."Favorite" DROP COLUMN "createdAt",
DROP COLUMN "propertyId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "property_id" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Inquiry" DROP COLUMN "createdAt",
DROP COLUMN "propertyId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "property_id" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "features",
DROP COLUMN "photos";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."PropertyImage" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyFeature" (
    "id" SERIAL NOT NULL,
    "feature" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "PropertyFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_property_id_key" ON "public"."Favorite"("user_id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_user_id_property_id_key" ON "public"."Inquiry"("user_id", "property_id");

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyImage" ADD CONSTRAINT "PropertyImage_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyFeature" ADD CONSTRAINT "PropertyFeature_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
