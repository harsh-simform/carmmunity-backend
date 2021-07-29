import * as User from './User'
import * as Post from './Post'
import * as Vehicle from './Vehicle'
import * as Comment from './Comment'

export const Query = {
  ...User,
  ...Post,
  ...Comment,
  ...Vehicle,
}
