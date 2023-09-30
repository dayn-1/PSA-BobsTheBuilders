-- CreateTable
CREATE TABLE "Berth" (
    "id" SERIAL NOT NULL,
    "berthId" TEXT NOT NULL,
    "terminal" TEXT NOT NULL,
    "numCranes" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "draught" INTEGER NOT NULL,
    "occupied" BOOLEAN NOT NULL,
    "nextAvail" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Berth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "shipId" INTEGER NOT NULL,
    "vesselName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "grossTonnage" INTEGER NOT NULL,
    "deadweight" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "beam" INTEGER NOT NULL,
    "draught" INTEGER NOT NULL,
    "eta" TIMESTAMP(3) NOT NULL,
    "etd" TIMESTAMP(3) NOT NULL,
    "berth" INTEGER NOT NULL,
    "linkedId" INTEGER NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Berth_berthId_key" ON "Berth"("berthId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipId_key" ON "Shipment"("shipId");
