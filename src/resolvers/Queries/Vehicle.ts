import { extendType } from 'nexus'

export const vehicle = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('vehicles', {
      type: 'Vehicle',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.vehicle.findMany()
      },
    })
  },
})
