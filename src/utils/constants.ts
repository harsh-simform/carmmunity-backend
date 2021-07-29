import { readFileSync } from 'fs'

export const tokens = {
  access: {
    name: 'ACCESS_TOKEN',
    expiry: '1d',
  },
}

export const APP_SECRET = readFileSync(process.env.PRIVATE_KEY, 'ascii')

export const isDev = () => process.env.NODE_ENV === 'development'

export const messages = {
  SIGNUP_SUCCESS: 'Signup Successful!',
}

export const errors = {
  internalServerError: {
    __typename: 'InternalServer',
    message: 'Internal Server Error!',
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
