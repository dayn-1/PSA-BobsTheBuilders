import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

interface Shipment {
  id: number;
  shipId: number;
  vesselName: string;
  type: string;
  flag: string;
  grossTonnage: number;
  deadweight: number;
  length: number;
  beam: number;
  draught: number;
  eta: Date;
  etd: Date;
  berth?: number;
  linkedId: number;
}

type ResponseData = {
  shipments: Shipment[]; // Replace YourShipmentType with the actual type of your shipments
  message: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Fetch shipments from the database using Prisma
    const shipments = await prisma.shipment.findMany();

    // Return the shipments as part of the response
    res.status(200).json({ shipments, message: "Data fetched successfully" });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ shipments: [], message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
