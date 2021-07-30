import * as Post from './Post'
import * as Vehicle from './Vehicle'
import * as User from './User'

export const Mutation = {
  ...Post,
  ...Vehicle,
  ...User,
}
