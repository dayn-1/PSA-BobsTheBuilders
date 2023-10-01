import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

interface Berth {
  id: number;
  berthId: string;
  terminal: string;
  numCranes: number;
  lat: number;
  long: number;
  length: number;
  width: number;
  draught: number;
  occupied: boolean;
  nextAvail: Date;
}

type ResponseData = {
  berths: Berth[]; // Replace YourShipmentType with the actual type of your shipments
  message: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Fetch shipments from the database using Prisma
    const berths = await prisma.berth.findMany();

    // Return the shipments as part of the response
    res.status(200).json({ berths, message: "Data fetched successfully" });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ berths: [], message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
