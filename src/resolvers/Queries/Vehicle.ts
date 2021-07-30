import { extendType } from 'nexus'

export const vehicle = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('vehicles', {
      type: 'Vehicle',
      args: {
        params: 'VehicleParamsInput',
      },
      resolve(_parent, { params }, ctx) {
        const { pagination, searchTerm } = params
        return ctx.prisma.vehicle.findMany({
          ...pagination,
          where: {
            OR: [
              {
                make: {
                  name: {
                    contains: searchTerm,
                  },
                },
              },
              {
                model: {
                  name: {
                    contains: searchTerm,
                  },
                },
              },
            ],
            garage: {
              owner: {
                id: ctx.userId,
              },
            },
          },
        })
      },
    })
  },
})
