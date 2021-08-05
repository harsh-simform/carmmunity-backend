import { extendType, arg } from 'nexus'

export const vehicle = extendType({
  type: 'Mutation',
  definition(t) {
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
        const createCompany = await ctx.prisma.company.create({
          data: {
            name: company,
          },
        })
        const createModel = await ctx.prisma.vehicleModel.create({
          data: {
            name: model,
            maker: {
              connect: {
                id: createCompany.id,
              },
            },
          },
        })
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
                id: createCompany.id,
              },
            },
            model: {
              connect: {
                id: createModel.id,
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
