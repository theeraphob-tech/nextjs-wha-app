import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  const prisma = new PrismaClient({ adapter })

  const email = "theeraphob_admin@barcamail.com"

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log("User not found")
    await prisma.$disconnect()
    return
  }

  // Check account
  const account = await prisma.account.findFirst({ where: { userId: user.id } })
  if (account) {
    console.log("Account exists, password hash:", account.password?.substring(0, 30) + "...")
  } else {
    console.log("No account found for user")
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
