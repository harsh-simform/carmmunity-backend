import { enumType, objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.firstname()
    t.model.lastname()
    t.model.profilePic()
    t.model.gender()
    t.model.garage()
    t.model.posts()
    t.model.fromFriendRequest()
    t.model.toFriendRequest()
    t.model.settings()
    t.model.createdAt()
    t.model.updatedAt()
    t.field('isRequestSent', {
      type: 'Boolean',
      args: {},
      resolve: async (parent, args, ctx) => {
        const requestCheck = await ctx.prisma.friendRequest.findFirst({
          where: {
            status: 'PENDING',
            OR: [
              {
                fromUser: {
                  id: ctx.userId,
                },
                toUser: {
                  id: parent.id,
                },
              },
              {
                toUser: {
                  id: ctx.userId,
                },
                fromUser: {
                  id: parent.id,
                },
              },
            ],
          },
        })
        if (requestCheck) return true
        return false
      },
    })
    t.field('isFriend', {
      type: 'Boolean',
      args: {},
      resolve: async (parent, args, ctx) => {
        const friendCheck = await ctx.prisma.friendRequest.findFirst({
          where: {
            status: 'ACCEPTED',
            OR: [
              {
                fromUser: {
                  id: ctx.userId,
                },
                toUser: {
                  id: parent.id,
                },
              },
              {
                toUser: {
                  id: ctx.userId,
                },
                fromUser: {
                  id: parent.id,
                },
              },
            ],
          },
        })
        if (friendCheck) return true
        return false
      },
    })
  },
})

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.content()
    t.model.author()
    t.model.comments()
    t.model.likes()
    t.model.photos()
    t.model.type()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.relationUser()
    t.field('isLiked', {
      type: 'Boolean',
      args: {},
      resolve: async (parent, args, ctx) => {
        const like = await ctx.prisma.like.findFirst({
          where: {
            author: {
              id: ctx.userId,
            },
            post: {
              id: parent.id,
            },
          },
        })
        if (like) return true
        return false
      },
    })
  },
})

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id()
    t.model.content()
    t.model.author()
    t.model.post()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Like = objectType({
  name: 'Like',
  definition(t) {
    t.model.id()
    t.model.post()
    t.model.author()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Garage = objectType({
  name: 'Garage',
  definition(t) {
    t.model.id()
    t.model.owner()
    t.model.vehicles()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Vehicle = objectType({
  name: 'Vehicle',
  definition(t) {
    t.model.id()
    t.model.garage()
    t.model.make()
    t.model.model()
    t.model.photos()
    t.model.year()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Company = objectType({
  name: 'Company',
  definition(t) {
    t.model.id()
    t.model.id()
    t.model.name()
    t.model.vehicle()
    t.model.vehicleModel()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Photos = objectType({
  name: 'Photos',
  definition(t) {
    t.model.id()
    t.model.post()
    t.model.postId()
    t.model.url()
    t.model.vehicle()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const FriendRequest = objectType({
  name: 'FriendRequest',
  definition(t) {
    t.model.id()
    t.model.status()
    t.model.toUser()
    t.model.fromUser()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const VehicleModel = objectType({
  name: 'VehicleModel',
  definition(t) {
    t.model.id()
    t.model.maker()
    t.model.name()
    t.model.vehicle()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Setting = objectType({
  name: 'Setting',
  definition(t) {
    t.model.id()
    t.model.events()
    t.model.friends()
    t.model.garage()
    t.model.location()
    t.model.photos()
  },
})

export const FeedType = enumType({
  name: 'FeedType',
  members: ['POST', 'RELATION', 'VEHICLE_ADDED'],
})

export const RelationStatus = enumType({
  name: 'RelationStatus',
  members: ['PENDING', 'ACCEPTED', 'REJECTED'],
})
