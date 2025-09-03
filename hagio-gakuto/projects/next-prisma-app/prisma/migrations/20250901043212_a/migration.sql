-- AlterTable
ALTER TABLE "public"."Property" ALTER COLUMN "build_date" SET DATA TYPE DATE,
ALTER COLUMN "chome" DROP NOT NULL,
ALTER COLUMN "block" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."RentAllowanceAddress" ALTER COLUMN "chome" DROP NOT NULL;
