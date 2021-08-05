import { extendType, intArg, stringArg } from 'nexus'
import { returnError } from '../../utils/helpers'

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
        const checkLikes = await ctx.prisma.like.findFirst({
          where: {
            author: {
              id: ctx.userId,
            },
            post: {
              id: postId,
            },
          },
        })
        if (checkLikes) {
          return returnError('alreadyLikedPost')
        }
        return ctx.prisma.like.create({
          data: {
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

    t.field('unlikePost', {
      type: 'Like',
      args: { params: 'LikePostInput' },
      resolve: async (_parent, { params }, ctx) => {
        const { postId } = params
        const like = await ctx.prisma.like.findFirst({
          where: { post: { id: postId }, author: { id: ctx.userId } },
        })
        if (!like) {
          return returnError('resourceNotFound')
        }
        return ctx.prisma.like.delete({ where: { id: like.id } })
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
      args: { commentId: intArg(), content: stringArg() },
      resolve: async (_parent, { commentId, content }, ctx) => {
        return ctx.prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            content: content,
          },
        })
      },
    })

    t.field('deleteComment', {
      type: 'Comment',
      args: { commentId: intArg() },
      resolve: async (_parent, { commentId }, ctx) => {
        return ctx.prisma.comment.delete({
          where: {
            id: commentId,
          },
        })
      },
    })
  },
})
