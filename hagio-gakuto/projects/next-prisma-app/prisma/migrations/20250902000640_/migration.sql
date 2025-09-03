/*
  Warnings:

  - You are about to drop the column `property_id` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `property_id` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FeatureToProperty` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,unit_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Layout` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PropertyType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Workplace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unit_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inquiry_category_id` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_id` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_property_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_property_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inquiry" DROP CONSTRAINT "Inquiry_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Property" DROP CONSTRAINT "Property_layout_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Property" DROP CONSTRAINT "Property_property_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyImage" DROP CONSTRAINT "PropertyImage_property_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentAllowanceAddress" DROP CONSTRAINT "RentAllowanceAddress_workplace_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FeatureToProperty" DROP CONSTRAINT "_FeatureToProperty_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FeatureToProperty" DROP CONSTRAINT "_FeatureToProperty_B_fkey";

-- DropIndex
DROP INDEX "public"."Favorite_user_id_property_id_key";

-- DropIndex
DROP INDEX "public"."Inquiry_user_id_property_id_key";

-- AlterTable
ALTER TABLE "public"."Favorite" DROP COLUMN "property_id",
ADD COLUMN     "unit_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Inquiry" DROP COLUMN "property_id",
ADD COLUMN     "inquiry_category_id" INTEGER NOT NULL,
ADD COLUMN     "unit_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."RentAllowanceAddress" ALTER COLUMN "chome" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "updated_at" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Property";

-- DropTable
DROP TABLE "public"."PropertyImage";

-- DropTable
DROP TABLE "public"."_FeatureToProperty";

-- CreateTable
CREATE TABLE "public"."Building" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "zip_code" VARCHAR(10) NOT NULL,
    "prefecture" VARCHAR(10) NOT NULL,
    "city" VARCHAR(20) NOT NULL,
    "town" VARCHAR(50) NOT NULL,
    "chome" VARCHAR(50),
    "block" VARCHAR(100) NOT NULL,
    "nearest_station" VARCHAR(100) NOT NULL,
    "walk_to_station" INTEGER NOT NULL,
    "build_date" DATE NOT NULL,
    "total_floors" INTEGER NOT NULL,
    "property_type_id" INTEGER NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Unit" (
    "id" SERIAL NOT NULL,
    "price_rent" INTEGER NOT NULL,
    "area_sqm" DECIMAL(65,30) NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_number" VARCHAR(10),
    "is_empty" BOOLEAN NOT NULL DEFAULT true,
    "building_id" INTEGER NOT NULL,
    "layout_id" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "building_id" INTEGER NOT NULL,
    "unit_id" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImageCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "ImageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UnitFeature" (
    "unit_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "UnitFeature_pkey" PRIMARY KEY ("unit_id","feature_id")
);

-- CreateTable
CREATE TABLE "public"."InquiryCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "InquiryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageCategory_name_key" ON "public"."ImageCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InquiryCategory_name_key" ON "public"."InquiryCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_unit_id_key" ON "public"."Favorite"("user_id", "unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "Layout_name_key" ON "public"."Layout"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_name_key" ON "public"."PropertyType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Workplace_name_key" ON "public"."Workplace"("name");

-- AddForeignKey
ALTER TABLE "public"."Building" ADD CONSTRAINT "Building_property_type_id_fkey" FOREIGN KEY ("property_type_id") REFERENCES "public"."PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Unit" ADD CONSTRAINT "Unit_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "public"."Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Unit" ADD CONSTRAINT "Unit_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "public"."Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."ImageCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "public"."Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UnitFeature" ADD CONSTRAINT "UnitFeature_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UnitFeature" ADD CONSTRAINT "UnitFeature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "public"."Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_inquiry_category_id_fkey" FOREIGN KEY ("inquiry_category_id") REFERENCES "public"."InquiryCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentAllowanceAddress" ADD CONSTRAINT "RentAllowanceAddress_workplace_id_fkey" FOREIGN KEY ("workplace_id") REFERENCES "public"."Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
