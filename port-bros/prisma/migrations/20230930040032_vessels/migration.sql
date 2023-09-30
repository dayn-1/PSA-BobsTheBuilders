-- CreateTable
CREATE TABLE "Vessel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tonnage" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "breadth" INTEGER NOT NULL,
    "eta" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);
