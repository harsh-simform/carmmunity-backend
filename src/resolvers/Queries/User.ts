import { extendType } from 'nexus'

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
        const { pagination, filter } = params
        return ctx.prisma.friendRequest.findMany({
          ...pagination,
          where: {
            status: filter,
            fromUser: {
              id: ctx.userId,
            },
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
                    status: 'ACCEPTED',
                  },
                },
              },
              {
                fromFriendRequest: {
                  some: {
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
