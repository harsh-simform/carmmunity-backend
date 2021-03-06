import * as Models from './models'
import * as Inputs from './Inputs'
import { Mutation } from './Mutations'
import { Subscription } from './Subscriptions'
import { Query } from './Queries'

export const resolvers = {
  ...Models,
  ...Inputs,
  Query,
  Mutation,
  Subscription,
}
