/*
  Warnings:

  - You are about to drop the column `age_years` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Property` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `zip` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `prefecture` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `city` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `street` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `block` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `nearest_station` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `floor_plan_url` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `image_url` on the `PropertyImage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `is_deleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `avatar_url` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `PropertyFeature` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `build_date` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layout_id` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_type_id` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_property_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_property_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyFeature" DROP CONSTRAINT "PropertyFeature_property_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyImage" DROP CONSTRAINT "PropertyImage_property_id_fkey";

-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "age_years",
DROP COLUMN "lat",
DROP COLUMN "layout",
DROP COLUMN "lng",
DROP COLUMN "type",
ADD COLUMN     "build_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_empty" BOOLEAN,
ADD COLUMN     "layout_id" INTEGER NOT NULL,
ADD COLUMN     "property_type_id" INTEGER NOT NULL,
ADD COLUMN     "room_number" VARCHAR(20),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "zip" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "prefecture" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "street" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "block" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "nearest_station" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "floor_plan_url" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."PropertyImage" ALTER COLUMN "image_url" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "is_deleted",
DROP COLUMN "role",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "role_id" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "avatar_url" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "public"."PropertyFeature";

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Layout" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workplace" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Workplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RentAllowanceAddress" (
    "id" SERIAL NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "prefecture" VARCHAR(10) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "block" VARCHAR(100) NOT NULL,
    "workplace_id" INTEGER NOT NULL,

    CONSTRAINT "RentAllowanceAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_FeatureToProperty" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FeatureToProperty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "public"."Feature"("name");

-- CreateIndex
CREATE INDEX "_FeatureToProperty_B_index" ON "public"."_FeatureToProperty"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_property_type_id_fkey" FOREIGN KEY ("property_type_id") REFERENCES "public"."PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "public"."Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyImage" ADD CONSTRAINT "PropertyImage_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentAllowanceAddress" ADD CONSTRAINT "RentAllowanceAddress_workplace_id_fkey" FOREIGN KEY ("workplace_id") REFERENCES "public"."Workplace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FeatureToProperty" ADD CONSTRAINT "_FeatureToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FeatureToProperty" ADD CONSTRAINT "_FeatureToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
