import { extendType } from 'nexus'
import { handleError } from '../../utils/helpers'

export const post = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('feed', {
      type: 'Post',
      args: {
        params: 'FeedParamsInput',
      },
      resolve: async (_parent, { params }, ctx) => {
        try {
          const { pagination, searchTerm } = params
          const friends = await ctx.prisma.friendRequest.findMany({
            where: {
              AND: [
                {
                  OR: [
                    {
                      fromUserId: ctx.userId,
                    },
                    {
                      toUserId: ctx.userId,
                    },
                  ],
                },
                {
                  status: 'ACCEPTED',
                },
              ],
            },
          })
          const friendsIds: number[] = []
          friends.forEach((item) => {
            friendsIds.push(item.fromUserId)
            friendsIds.push(item.toUserId)
          })
          return ctx.prisma.post.findMany({
            ...pagination,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              author: {
                AND: [
                  {
                    id: {
                      not: ctx.userId,
                    },
                  },
                  {
                    id: {
                      in: friendsIds,
                    },
                  },
                ],
              },
              content: {
                contains: searchTerm,
              },
            },
          })
        } catch (err) {
          handleError(err)
        }
      },
    })

    t.nonNull.list.field('myActivity', {
      type: 'Post',
      args: {
        params: 'FeedParamsInput',
      },
      resolve(_parent, { params }, ctx) {
        const { pagination, searchTerm } = params
        return ctx.prisma.post.findMany({
          ...pagination,
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            content: {
              contains: searchTerm,
            },
            author: {
              id: ctx.userId,
            },
          },
        })
      },
    })
  },
})
