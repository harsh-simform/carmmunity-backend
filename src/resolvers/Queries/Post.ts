import { extendType } from 'nexus'

export const post = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('feed', {
      type: 'Post',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.post.findMany()
      },
    })
  },
})
