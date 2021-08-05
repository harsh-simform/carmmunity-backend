import { PrismaClient, Company, VehicleModel } from '@prisma/client'
import axios from 'axios'
import { config } from 'dotenv'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
config()
const prisma = new PrismaClient()

async function main() {}

main().finally(async () => {
  await prisma.$disconnect()
  console.log('Seed ran $$$$')
})
