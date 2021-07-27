import { stringArg, extendType, nonNull } from 'nexus'
import { compare, hash } from 'bcrypt'
import { generateAccessToken, returnError } from '../../utils/helpers'
import { messages } from '../../utils/constants'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'SignupResult',
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { firstName, lastName, email, password }, ctx) {
        try {
          const hashedPassword = await hash(password, 10)
          await ctx.prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              password: hashedPassword,
            },
          })

          return {
            message: messages.SIGNUP_SUCCESS,
          }
        } catch (e) {
          return returnError('userAlreadyExists')
        }
      },
    })

    t.field('login', {
      type: 'LoginResult',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { email, password }, ctx) {
        let user = null
        try {
          user = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          })
        } catch (e) {
          return returnError('invalidUser')
        }

        if (!user) return returnError('invalidUser')

        const passwordValid = await compare(password, user.password)
        if (!passwordValid) return returnError('invalidUser')

        const accessToken = generateAccessToken(user.id)
        return {
          __typename: 'AuthPayload',
          accessToken,
          user,
        }
      },
    })
  },
})
