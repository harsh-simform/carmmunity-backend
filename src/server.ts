import { config } from 'dotenv'
config()

import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from './utils/rules'
import { schema } from './schema'
import { isDev } from './utils/constants'
import { createContext } from './utils/helpers'

const env = process.env.APP_ENV

export const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
  playground: env !== 'production' ? true : false,
  tracing: isDev(),
  formatError: (err) => {
    if (env !== 'development') {
      delete err.extensions.exception
    }
    return err
  },
  introspection: true,
  debug: isDev(),
})
