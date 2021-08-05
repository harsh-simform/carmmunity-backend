import { extendType, arg, intArg } from 'nexus'

export const vehicle = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteVehicle', {
      type: 'Vehicle',
      args: {
        vehicleId: intArg(),
      },
      resolve: (_parent, { vehicleId }, ctx) => {
        return ctx.prisma.vehicle.delete({
          where: { id: vehicleId },
        })
      },
    })

    t.field('createVehicle', {
      type: 'Vehicle',
      args: {
        params: 'CreateVehicleInput',
      },
      resolve: async (_parent, { params }, ctx) => {
        const { year, company, model, photos } = params
        const checkUserHasGarage = await ctx.prisma.garage.findFirst({
          where: {
            owner: {
              id: ctx.userId,
            },
          },
        })
        let garageId: number
        if (checkUserHasGarage) {
          garageId = checkUserHasGarage.id
        } else {
          const garage = await ctx.prisma.garage.create({
            data: {
              owner: {
                connect: {
                  id: ctx.userId,
                },
              },
            },
          })
          garageId = garage.id
        }
        let companyId: number
        const checkCompany = await ctx.prisma.company.findFirst({
          where: {
            name: {
              equals: company,
              mode: 'insensitive',
            },
          },
        })
        if (checkCompany) {
          companyId = checkCompany.id
        } else {
          const createCompany = await ctx.prisma.company.create({
            data: {
              name: company,
            },
          })
          companyId = createCompany.id
        }
        let modelId: number
        const checkModel = await ctx.prisma.vehicleModel.findFirst({
          where: {
            year,
            name: {
              equals: model,
              mode: 'insensitive',
            },
          },
        })
        if (checkModel) {
          modelId = checkModel.id
        } else {
          const createModel = await ctx.prisma.vehicleModel.create({
            data: {
              name: model,
              year,
              maker: {
                connect: {
                  id: companyId,
                },
              },
            },
          })
          modelId = createModel.id
        }
        const vehicle = await ctx.prisma.vehicle.create({
          data: {
            year,
            garage: {
              connect: {
                id: garageId,
              },
            },
            make: {
              connect: {
                id: companyId,
              },
            },
            model: {
              connect: {
                id: modelId,
              },
            },
          },
        })
        const post = await ctx.prisma.post.create({
          data: {
            type: 'VEHICLE_ADDED',
            author: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        })
        const photosData = photos.map((item) => {
          return {
            url: item,
            post: {
              connect: {
                id: post.id,
              },
            },
            vehicle: {
              connect: {
                id: vehicle.id,
              },
            },
          }
        })
        const promises = photosData.map(async (item) => {
          return new Promise<void>(async (resolve, reject) => {
            ctx.prisma.photos
              .create({
                data: item,
              })
              .then(() => {
                resolve()
              })
              .catch((err) => {
                reject(err)
              })
          })
        })
        await Promise.all(promises)
        ctx.pubsub.publish('latestPost', post)
        return vehicle
      },
    })
  },
})
