import { extendType, intArg } from 'nexus'

export const comments = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('comments', {
      type: 'Comment',
      args: { postId: intArg() },
      resolve: (_parent, { postId }, ctx) => {
        return ctx.prisma.comment.findMany({
          where: {
            post: {
              id: postId,
            },
          },
        })
      },
    })
  },
})
