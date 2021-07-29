import { intArg, extendType, nonNull, stringArg, arg } from 'nexus'
import { returnError } from '../../utils/helpers'

export const post = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPost', {
      type: 'Post',
      args: { params: arg({ type: 'CreatePostInput' }) },
      //@ts-ignore
      resolve: async (_parent, { params }, ctx) => {
        try {
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
          await ctx.prisma.photos.createMany({
            data: photosData,
          })
          return post
        } catch (err) {
          return returnError(err)
        }
      },
    })

    t.field('likePost', {
      type: 'Like',
      args: { params: arg({ type: 'LikePostInput' }) },
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

    t.field('postComment', {
      type: 'Comment',
      args: { params: arg({ type: 'PostCommentInput' }) },
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
  },
})
