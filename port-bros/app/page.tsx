import Image from "next/image";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(options);
  return <div>Home</div>;
}