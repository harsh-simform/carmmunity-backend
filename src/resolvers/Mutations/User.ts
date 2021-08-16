import { extendType, intArg, stringArg } from 'nexus'
import { returnError, handleError } from '../../utils/helpers'
import { Prisma } from '@prisma/client'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('editUserProfile', {
      type: 'User',
      args: {
        params: 'EditUserInput',
      },
      resolve: async (_parent, { params }, ctx) => {
        const {
          events,
          firstname,
          friends,
          garage,
          gender,
          lastname,
          location,
          photos,
          profilePic,
        } = params

        let updateData: Prisma.UserUpdateInput = {}

        if (firstname) {
          updateData.firstname = firstname
        }

        if (lastname) {
          updateData.lastname = firstname
        }

        if (gender) {
          updateData.gender = gender
        }

        if (profilePic) {
          updateData.profilePic = profilePic
        }

        if (location) {
          updateData = {
            ...updateData,
            settings: {
              upsert: {
                update: { location },
                create: { location },
              },
            },
          }
        }

        if (photos) {
          updateData = {
            ...updateData,
            settings: {
              upsert: {
                update: { photos },
                create: { photos },
              },
            },
          }
        }

        if (garage) {
          updateData = {
            ...updateData,
            settings: {
              upsert: {
                update: { garage },
                create: { garage },
              },
            },
          }
        }

        if (friends) {
          updateData = {
            ...updateData,
            settings: {
              upsert: {
                update: { friends },
                create: { friends },
              },
            },
          }
        }

        if (events) {
          updateData = {
            ...updateData,
            settings: {
              upsert: {
                update: { events },
                create: { events },
              },
            },
          }
        }

        return ctx.prisma.user.update({
          where: { id: ctx.userId },
          data: updateData,
        })
      },
    })
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
