import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  const prisma = new PrismaClient({ adapter })

  const user = await prisma.user.findUnique({
    where: { email: "theeraphob_admin@barcamail.com" },
    select: { id: true, name: true, email: true, role: true }
  })
  console.log("User:", JSON.stringify(user, null, 2))

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
