import { inputObjectType } from 'nexus'

export const PaginationInput = inputObjectType({
  name: 'PaginationInput',
  definition(t) {
    t.field('skip', { type: 'Int' })
    t.field('take', { type: 'Int' })
  },
})

export const CreatePostInput = inputObjectType({
  name: 'CreatePostInput',
  definition(t) {
    t.nonNull.string('content')
    t.list.field('photos', { type: 'String' })
  },
})

export const CreateVehicleInput = inputObjectType({
  name: 'CreateVehicleInput',
  definition(t) {
    t.nonNull.int('year')
    t.nonNull.int('companyId')
    t.nonNull.int('modelId')
    t.list.field('photos', { type: 'String' })
  },
})

export const LikePostInput = inputObjectType({
  name: 'LikePostInput',
  definition(t) {
    t.nonNull.int('postId')
  },
})

export const PostCommentInput = inputObjectType({
  name: 'PostCommentInput',
  definition(t) {
    t.nonNull.int('postId')
    t.nonNull.string('content')
  },
})
