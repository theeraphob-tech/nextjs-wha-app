import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  const prisma = new PrismaClient({ adapter })

  const email = "theeraphob_admin@barcamail.com"

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log(`❌ User with email "${email}" not found.`)
    console.log("Available users:")
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
    for (const u of users) {
      console.log(`  - ${u.email} (${u.name})`)
    }
    await prisma.$disconnect()
    return
  }

  console.log(`✅ Found user: ${user.name} (${user.email})`)
  console.log(`   Current role: ${user.role}`)

  // Update role to admin
  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  })

  console.log(`✅ Role updated to "admin" successfully!`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Error:", e.message)
  process.exit(1)
})
