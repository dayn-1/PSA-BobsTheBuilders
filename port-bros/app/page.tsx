import Image from "next/image";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await getServerSession(options);
  const usr = await prisma.user.findFirst({
    where: {
      email: "test@test.com",
    },
  });
  return (
    <main>
      <div>Hello, {usr?.name} </div>
    </main>
  );
}
