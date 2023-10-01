import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "./auth/[...nextauth]/options";
import exp from "constants";

export async function GET(request: Request) {
  const session = await getServerSession(options);
  console.log("Get API, ", session)
  return NextResponse.json({ authenticated: !!session });
}
