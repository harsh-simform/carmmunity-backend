import { inputObjectType } from 'nexus'

export const PaginationInput = inputObjectType({
  name: 'PaginationInput',
  definition(t) {
    t.int('skip')
    t.int('take')
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
    t.nonNull.string('company')
    t.nonNull.string('model')
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
    // t.nonNull.field('filter', { type: 'RelationStatus' })
  },
})

export const GetFriendsInput = inputObjectType({
  name: 'GetFriendsInput',
  definition(t) {
    t.field('pagination', { type: 'PaginationInput' })
    t.nullable.string('searchTerm')
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

export const EditUserInput = inputObjectType({
  name: 'EditUserInput',
  definition(t) {
    t.string('firstname')
    t.string('lastname')
    t.field('gender', { type: 'Gender' })
    t.string('profilePic')
    t.field('location', { type: 'PrivacyOption' })
    t.field('photos', { type: 'PrivacyOption' })
    t.field('garage', { type: 'PrivacyOption' })
    t.field('friends', { type: 'PrivacyOption' })
    t.field('events', { type: 'PrivacyOption' })
  },
})
