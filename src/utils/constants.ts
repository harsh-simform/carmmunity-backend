import { readFileSync } from 'fs'

export const tokens = {
  access: {
    name: 'ACCESS_TOKEN',
    expiry: '1d',
  },
}

export interface IS3FileUpload {
  file: any
  bucketPath: string
}

export const APP_SECRET = readFileSync(process.env.PRIVATE_KEY, 'ascii')

export const isDev = () => process.env.NODE_ENV === 'development'

export const messages = {
  SIGNUP_SUCCESS: 'Signup Successful!',
}

export const errors = {
  friendRequestNotFound: {
    __typename: 'FriendRequestNotFound',
    message: 'Friend request not found',
  },
  invalidUser: {
    __typename: 'InvalidUser',
    message: 'Invalid username or password',
  },
  userAlreadyExists: {
    __typename: 'UserAlreadyExists',
    message: 'User already exists!',
  },
}

export type Errors = typeof errors
