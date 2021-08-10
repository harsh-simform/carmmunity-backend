import { extendType, intArg, stringArg } from 'nexus'

export const user = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('me', {
      type: 'User',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
        })
      },
    })

    t.nonNull.list.field('myRequests', {
      type: 'FriendRequest',
      args: {
        params: 'GetRequestInput',
      },
      resolve: (_parent, { params }, ctx) => {
        const { pagination } = params
        return ctx.prisma.friendRequest.findMany({
          ...pagination,
          where: {
            status: 'PENDING',
            toUser: {
              id: ctx.userId,
            },
          },
        })
      },
    })

    t.nonNull.list.field('getUsersList', {
      type: 'User',
      args: {
        search: stringArg(),
        skip: intArg(),
        take: intArg(),
      },
      resolve: async (_parent, { search, take, skip }, ctx) => {
        return ctx.prisma.user.findMany({
          take,
          skip,
          where: {
            id: {
              not: {
                equals: ctx.userId,
              },
            },
            OR: [
              {
                firstname: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                lastname: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        })
      },
    })

    t.nonNull.list.field('friends', {
      type: 'User',
      args: {
        params: 'GetFriendsInput',
      },
      resolve: (_parent, { params }, ctx) => {
        const { pagination } = params
        return ctx.prisma.user.findMany({
          ...pagination,
          where: {
            id: {
              not: ctx.userId,
            },
            OR: [
              {
                toFriendRequest: {
                  some: {
                    fromUser: {
                      id: ctx.userId,
                    },
                    status: 'ACCEPTED',
                  },
                },
              },
              {
                fromFriendRequest: {
                  some: {
                    toUser: {
                      id: ctx.userId,
                    },
                    status: 'ACCEPTED',
                  },
                },
              },
            ],
          },
        })
      },
    })
  },
})
