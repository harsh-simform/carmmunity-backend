import { extendType, intArg } from 'nexus'

export const post = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPost', {
      type: 'Post',
      args: { params: 'CreatePostInput' },
      resolve: async (_parent, { params }, ctx) => {
        const { content, photos } = params
        const post = await ctx.prisma.post.create({
          data: {
            type: 'POST',
            author: {
              connect: {
                id: ctx.userId,
              },
            },
            content,
          },
        })
        const photosData = photos.map((item) => {
          return {
            url: item,
            post: {
              connect: {
                id: post.id,
              },
            },
          }
        })
        const promises = photosData.map(async (item) => {
          return new Promise<void>(async (resolve, reject) => {
            ctx.prisma.photos
              .create({
                data: item,
              })
              .then(() => {
                resolve()
              })
              .catch((err) => {
                reject(err)
              })
          })
        })
        await Promise.all(promises)
        ctx.pubsub.publish('latestPost', post)
        return post
      },
    })

    t.field('likePost', {
      type: 'Like',
      args: { params: 'LikePostInput' },
      resolve: async (_parent, { params }, ctx) => {
        const { postId } = params
        return ctx.prisma.like.create({
          data: {
            user: {
              connect: {
                id: ctx.userId,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
          },
        })
      },
    })

    t.field('unlikePost', {
      type: 'Like',
      args: { params: 'LikePostInput' },
      resolve: async (_parent, { params }, ctx) => {
        const { postId } = params
        const like = await ctx.prisma.like.findFirst({
          where: { post: { id: postId } },
        })
        return ctx.prisma.like.update({
          where: {
            id: like.id,
          },
          data: {
            user: {
              disconnect: {
                id: ctx.userId,
              },
            },
          },
        })
      },
    })

    t.field('postComment', {
      type: 'Comment',
      args: { params: 'PostCommentInput' },
      resolve: async (_parent, { params }, ctx) => {
        const { postId, content } = params
        return ctx.prisma.comment.create({
          data: {
            content,
            author: {
              connect: {
                id: ctx.userId,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
          },
        })
      },
    })

    t.field('updateComment', {
      type: 'Comment',
      args: { params: 'PostCommentInput' },
      resolve: async (_parent, { params }, ctx) => {
        const { postId, content } = params
        const comment = await ctx.prisma.comment.findFirst({
          where: {
            AND: [
              {
                post: { id: postId },
              },
              {
                author: { id: ctx.userId },
              },
            ],
          },
        })
        return ctx.prisma.comment.update({
          where: {
            id: comment.id,
          },
          data: {
            content: content,
          },
        })
      },
    })

    t.field('deleteComment', {
      type: 'Comment',
      args: { postId: intArg() },
      resolve: async (_parent, { postId }, ctx) => {
        const comment = await ctx.prisma.comment.findFirst({
          where: {
            AND: [
              {
                post: { id: postId },
              },
              {
                author: { id: ctx.userId },
              },
            ],
          },
        })
        return ctx.prisma.comment.delete({
          where: {
            id: comment.id,
          },
        })
      },
    })
  },
})
