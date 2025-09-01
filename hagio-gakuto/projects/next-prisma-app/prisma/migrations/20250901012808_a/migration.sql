/*
  Warnings:

  - You are about to drop the column `street` on the `Property` table. All the data in the column will be lost.
  - You are about to alter the column `city` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to drop the column `block` on the `RentAllowanceAddress` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `RentAllowanceAddress` table. All the data in the column will be lost.
  - You are about to alter the column `city` on the `RentAllowanceAddress` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - Added the required column `chome` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `block` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `chome` to the `RentAllowanceAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `RentAllowanceAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "street",
ADD COLUMN     "building" VARCHAR(100),
ADD COLUMN     "chome" INTEGER NOT NULL,
ADD COLUMN     "town" VARCHAR(50) NOT NULL,
ALTER COLUMN "city" SET DATA TYPE VARCHAR(20),
DROP COLUMN "block",
ADD COLUMN     "block" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."RentAllowanceAddress" DROP COLUMN "block",
DROP COLUMN "street",
ADD COLUMN     "chome" INTEGER NOT NULL,
ADD COLUMN     "town" VARCHAR(50) NOT NULL,
ALTER COLUMN "city" SET DATA TYPE VARCHAR(20);
