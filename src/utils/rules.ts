import { shield, rule, allow } from 'graphql-shield'
import { Context } from '../types'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, ctx: Context) => {
      try {
        if (ctx.userId === -1) {
          return Error('Unauthenticated user!')
        }
        return true
      } catch (e) {
        return e
      }
    }
  ),
}

export const permissions = shield(
  {
    Query: {
      me: rules.isAuthenticatedUser,
      '*': allow,
    },
    Mutation: {
      '*': allow,
    },
  },
  {
    allowExternalErrors: true,
    debug: true,
  }
)
