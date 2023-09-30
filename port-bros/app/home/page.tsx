import { PrismaClient } from "@prisma/client";

export default async function Home() {
  const prisma = new PrismaClient();

  // const vessels = await prisma.vessel.findMany();
  // console.log(vessels);
  return (
    <main>
      {/* {vessels.map((vessel) => (
        <div key={vessel.id}>{vessel.name}</div>
      ))} */}
    </main>
  );
}
