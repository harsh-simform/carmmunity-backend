import { extendType, intArg, stringArg } from 'nexus'
import axios from 'axios'

export const vehicle = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('years', {
      type: 'Json',
      resolve: async (_parent, args, ctx) => {
        const response = await axios.get(
          `${process.env.CARS_BASE_URL}/${process.env.CARS_API_VERSION}/?cmd=getYears`
        )
        return response.data.Years
      },
    })

    t.nonNull.field('getVehicleDetails', {
      type: 'Json',
      args: {
        make: stringArg(),
        model: stringArg(),
        year: intArg(),
      },
      resolve: async (_parent, { make, model, year }, ctx) => {
        const response = await axios.get(
          `${process.env.CARS_BASE_URL}/${process.env.CARS_API_VERSION}/?cmd=getTrims&make=${make}&year=${year}`
        )
        return response.data.Trims
      },
    })

    t.nonNull.field('models', {
      type: 'Json',
      args: {
        params: 'ModelFilterInput',
      },
      resolve: async (_parent, { params }, ctx) => {
        const { make } = params
        let url = `${process.env.CARS_BASE_URL}/${process.env.CARS_API_VERSION}/?cmd=getModels`
        if (make) {
          url += `&make=${make}`
        }
        const response = await axios.get(url)
        return response.data.Models
      },
    })

    t.nonNull.field('makes', {
      type: 'Json',
      args: {
        params: 'MakesFilterInput',
      },
      resolve: async (_parent, { params }, ctx) => {
        const { year } = params
        let url = `${process.env.CARS_BASE_URL}/${process.env.CARS_API_VERSION}/?cmd=getMakes`
        if (year) {
          url += `&year=${year}`
        }
        const response = await axios.get(url)
        return response.data.Makes
      },
    })

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
