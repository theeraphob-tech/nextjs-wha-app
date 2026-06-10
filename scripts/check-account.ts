import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  const prisma = new PrismaClient({ adapter })

  const user = await prisma.user.findUnique({
    where: { email: "theeraphob_admin@barcamail.com" },
    include: { accounts: true }
  })
  if (!user) {
    console.log("User not found")
    await prisma.$disconnect()
    return
  }

  const account = user.accounts[0]
  if (account) {
    console.log("Email:", user.email)
    console.log("Provider:", account.providerId)
    console.log("Has password:", !!account.password)
    console.log("Password hash:", account.password?.substring(0, 40) + "...")
  } else {
    console.log("No accounts found")
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
