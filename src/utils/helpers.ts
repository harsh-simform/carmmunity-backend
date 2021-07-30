import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { sign, verify } from 'jsonwebtoken'
import { APP_SECRET, Errors, errors, tokens } from './constants'
import { Context, Token } from '../types'

export const handleError = (error: any) => {
  // add any other logging mechanism here e.g. Sentry
  throw new Error(error)
}

export const returnError = (error: keyof Errors) => {
  throw new Error(errors[error].message)
}

export const generateAccessToken = (userId: number) => {
  const accessToken = sign(
    {
      userId,
      type: tokens.access.name,
      timestamp: Date.now(),
    },
    APP_SECRET,
    {
      expiresIn: tokens.access.expiry,
    }
  )
  return accessToken
}

export const prisma = new PrismaClient()
const pubsub = new PubSub()

export const createContext = (ctx: any): Context => {
  let userId: number
  try {
    let Authorization = ''
    try {
      // for queries and mutations
      Authorization = ctx.req.get('Authorization')
    } catch (e) {
      // specifically for subscriptions as the above will fail
      Authorization = ctx?.connection?.context?.Authorization
    }
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    if (!verifiedToken.sub) {
      userId = -1
    } else {
      const data = verifiedToken.sub.split('|')
      userId = Number(data[1])
    }
  } catch (e) {
    userId = -1
  }
  return {
    ...ctx,
    prisma,
    pubsub,
    userId,
  }
}
