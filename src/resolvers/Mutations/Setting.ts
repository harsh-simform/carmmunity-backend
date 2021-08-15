import { extendType, intArg, stringArg } from 'nexus'
import { returnError } from '../../utils/helpers'

export const setting = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateUserSetting', {
      type: 'User',
      args: {
        events: 'PrivacyOption',
        friends: 'PrivacyOption',
        garage: 'PrivacyOption',
        location: 'PrivacyOption',
        photos: 'PrivacyOption',
      },
      resolve: async (
        _parent,
        { events, friends, garage, location, photos },
        ctx
      ) => {
        return ctx.prisma.user.update({
          where: {
            id: ctx.userId,
          },
          data: {
            settings: {
              update: {
                events,
                friends,
                garage,
                location,
                photos,
              },
            },
          },
        })
      },
    })
  },
})
