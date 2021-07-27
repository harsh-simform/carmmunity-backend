import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // seed run
}

main().finally(async () => {
  await prisma.$disconnect()
})
