import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  const prisma = new PrismaClient({ adapter })

  // Check all users
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  })
  console.log("Users:", JSON.stringify(users, null, 2))

  // Check Account table
  try {
    const accounts = await prisma.account.findMany()
    console.log("Accounts count:", accounts.length)
    console.log("Accounts:", JSON.stringify(accounts.map(a => ({ id: a.id, providerId: a.providerId, accountId: a.accountId, userId: a.userId })), null, 2))
  } catch (e) {
    console.log("Account table error:", (e as Error).message)
  }

  // Check Session table
  try {
    const sessions = await prisma.session.findMany()
    console.log("Sessions count:", sessions.length)
  } catch (e) {
    console.log("Session table error:", (e as Error).message)
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
