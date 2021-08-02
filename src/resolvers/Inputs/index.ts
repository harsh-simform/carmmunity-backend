import { enumType, inputObjectType } from 'nexus'

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

export const FeedParamsInput = inputObjectType({
  name: 'FeedParamsInput',
  definition(t) {
    t.field('pagination', { type: 'PaginationInput' })
    t.string('searchTerm')
  },
})

export const VehicleParamsInput = inputObjectType({
  name: 'VehicleParamsInput',
  definition(t) {
    t.field('pagination', { type: 'PaginationInput' })
    t.string('searchTerm')
  },
})

export const AddFriendInput = inputObjectType({
  name: 'AddFriendInput',
  definition(t) {
    t.nonNull.int('toUserId')
  },
})

export const GetRequestInput = inputObjectType({
  name: 'GetRequestInput',
  definition(t) {
    t.field('pagination', { type: 'PaginationInput' })
    t.nonNull.field('filter', { type: 'RelationStatus' })
  },
})

export const GetFriendsInput = inputObjectType({
  name: 'GetFriendsInput',
  definition(t) {
    t.field('pagination', { type: 'PaginationInput' })
  },
})

export const MakesFilterInput = inputObjectType({
  name: 'MakesFilterInput',
  definition(t) {
    t.nonNull.int('year')
  },
})

export const ModelFilterInput = inputObjectType({
  name: 'ModelFilterInput',
  definition(t) {
    t.nonNull.string('make')
  },
})
