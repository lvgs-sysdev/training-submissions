/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `property_id` on the `Favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `property_id` on the `Inquiry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `walk_to_station` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `property_id` on the `PropertyFeature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `property_id` on the `PropertyImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
ALTER TABLE "public"."Favorite" DROP COLUMN "property_id",
ADD COLUMN     "property_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Inquiry" DROP COLUMN "property_id",
ADD COLUMN     "property_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Property" DROP CONSTRAINT "Property_pkey",
ADD COLUMN     "walk_to_station" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "zip" SET DATA TYPE TEXT,
ALTER COLUMN "prefecture" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "street" SET DATA TYPE TEXT,
ALTER COLUMN "block" SET DATA TYPE TEXT,
ALTER COLUMN "lat" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "lng" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "nearest_station" SET DATA TYPE TEXT,
ALTER COLUMN "area_sqm" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "layout" SET DATA TYPE TEXT,
ALTER COLUMN "floor_plan_url" SET DATA TYPE TEXT,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PropertyFeature" DROP COLUMN "property_id",
ADD COLUMN     "property_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."PropertyImage" DROP COLUMN "property_id",
ADD COLUMN     "property_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_property_id_key" ON "public"."Favorite"("user_id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_user_id_property_id_key" ON "public"."Inquiry"("user_id", "property_id");

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyImage" ADD CONSTRAINT "PropertyImage_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyFeature" ADD CONSTRAINT "PropertyFeature_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
