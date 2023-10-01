import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const bobPassword = await hash('bob123', 12)
  const alicePassword = await hash('alice123', 12)
  const bob = await prisma.user.upsert({
    where: { email: "tmp@est.com" },    //may need to change 
    update: {},
    create: {
      email: "tmp@est.com",
      name: "Bob",
      password: bobPassword,
    },
  })
  
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: alicePassword,
    },
  });
  console.log({ bobPassword });

  
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })