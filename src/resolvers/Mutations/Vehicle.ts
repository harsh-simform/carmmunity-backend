import { extendType, arg } from 'nexus'
import { returnError } from '../../utils/helpers'

export const vehicle = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createVehicle', {
      type: 'Vehicle',
      args: {
        params: arg({ type: 'CreateVehicleInput' }),
      },
      //@ts-ignore
      resolve: async (_parent, { params }, ctx) => {
        try {
          const { year, companyId, modelId, photos } = params
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
          const photosData = photos.map((item) => {
            return {
              url: item,
              vehicle: {
                connect: {
                  id: vehicle.id,
                },
              },
            }
          })
          await ctx.prisma.photos.createMany({
            data: photosData,
          })
          return vehicle
        } catch (err) {
          return returnError(err)
        }
      },
    })
  },
})
