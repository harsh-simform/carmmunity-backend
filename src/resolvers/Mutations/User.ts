import { extendType, intArg, stringArg } from 'nexus'
import { returnError, handleError } from '../../utils/helpers'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addFriendRequest', {
      type: 'FriendRequest',
      args: {
        params: 'AddFriendInput',
      },
      resolve: (_parent, { params }, ctx) => {
        const { toUserId } = params
        return ctx.prisma.friendRequest.create({
          data: {
            status: 'PENDING',
            fromUser: {
              connect: {
                id: ctx.userId,
              },
            },
            toUser: {
              connect: {
                id: toUserId,
              },
            },
          },
        })
      },
    })

    t.field('acceptFriendRequest', {
      type: 'FriendRequest',
      args: {
        fromUserId: intArg(),
      },
      resolve: async (_parent, { fromUserId }, ctx) => {
        try {
          const request = await ctx.prisma.friendRequest.findUnique({
            where: {
              toUserId_fromUserId: {
                fromUserId,
                toUserId: ctx.userId,
              },
            },
          })
          if (!request) {
            return returnError('friendRequestNotFound')
          }
          const friendRequest = await ctx.prisma.friendRequest.update({
            where: {
              id: request.id,
            },
            data: {
              status: 'ACCEPTED',
            },
          })

          await ctx.prisma.post.create({
            data: {
              type: 'RELATION',
              author: {
                connect: {
                  id: ctx.userId,
                },
              },
              relationUser: {
                connect: {
                  id: fromUserId,
                },
              },
            },
          })

          return friendRequest
        } catch (err) {
          handleError(err)
        }
      },
    })

    t.field('declineFriendRequest', {
      type: 'FriendRequest',
      args: {
        fromUserId: intArg(),
      },
      resolve: async (_parent, { fromUserId }, ctx) => {
        try {
          const request = await ctx.prisma.friendRequest.findUnique({
            where: {
              toUserId_fromUserId: {
                fromUserId,
                toUserId: ctx.userId,
              },
            },
          })
          if (!request) {
            return returnError('friendRequestNotFound')
          }
          return ctx.prisma.friendRequest.update({
            where: {
              id: request.id,
            },
            data: {
              status: 'REJECTED',
            },
          })
        } catch (err) {
          handleError(err)
        }
      },
    })
  },
})
