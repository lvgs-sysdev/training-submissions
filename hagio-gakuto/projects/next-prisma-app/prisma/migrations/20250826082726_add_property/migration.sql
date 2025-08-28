-- CreateTable
CREATE TABLE "public"."Property" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "price_rent" INTEGER NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "prefecture" VARCHAR(10) NOT NULL,
    "city" VARCHAR(20) NOT NULL,
    "street" VARCHAR(50) NOT NULL,
    "block" VARCHAR(20) NOT NULL,
    "lat" DECIMAL(10,6) NOT NULL,
    "lng" DECIMAL(10,6) NOT NULL,
    "nearest_station" VARCHAR(100) NOT NULL,
    "area_sqm" DECIMAL(5,1) NOT NULL,
    "layout" VARCHAR(10) NOT NULL,
    "age_years" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "total_floors" INTEGER NOT NULL,
    "features" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "floor_plan_url" VARCHAR(200) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
