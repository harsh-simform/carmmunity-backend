import { PrismaClient, Company, VehicleModel } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // seed run
  // const company_data = [
  //   {
  //     name: 'BMW',
  //   },
  //   {
  //     name: 'Chevrolet',
  //   },
  //   {
  //     name: 'Ford',
  //   },
  // ]

  // for (const item of company_data) {
  //   await prisma.company.create({
  //     data: {
  //       name: item.name,
  //     },
  //   })
  // }

  const model_data = [
    {
      name: 'BMW X5',
      company: 1,
    },
    {
      name: 'BMW 5 Series',
      company: 1,
    },
    {
      name: 'BMW X3',
      company: 1,
    },
    {
      name: 'Ford EcoSport',
      company: 3,
    },
    {
      name: 'Ford Figo',
      company: 3,
    },
    {
      name: 'Ford Aspire',
      company: 3,
    },
  ]

  for (const item of model_data) {
    await prisma.vehicleModel.create({
      data: {
        name: item.name,
        maker: {
          connect: {
            id: item.company,
          },
        },
      },
    })
  }
}

main().finally(async () => {
  await prisma.$disconnect()
  console.log('Seed ran $$$$')
})
