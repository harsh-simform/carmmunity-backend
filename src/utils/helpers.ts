import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { sign, verify } from 'jsonwebtoken'
import { APP_SECRET, Errors, errors, IS3FileUpload, tokens } from './constants'
import { Context, Token } from '../types'
import path from 'path'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { createReadStream, unlinkSync } from 'fs'
import { S3 } from 'aws-sdk'

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
})

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

export const uploadToS3Bucket = async (
  data: IS3FileUpload
): Promise<string | any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { file, bucketPath } = data
      const extension = path.extname(file.originalname)
      const newFilename = `${getTime()}${extension}`
      const newPath = `${bucketPath}/${newFilename}`
      const myBucket = String(process.env.BUCKET_NAME)
      const params: PutObjectRequest = {
        Bucket: myBucket,
        Key: newPath,
        Body: createReadStream(file.path),
        ContentEncoding: 'base64',
        ACL: 'public-read',
        ContentType: file.type,
      }
      s3.putObject(params, (error, result) => {
        unlinkSync(file.path)
        if (error) {
          reject(error)
        }
        resolve({ Key: params.Key })
      })
    } catch (error) {
      reject(error)
    }
  })
}

export const fileRemoveFroms3Bucket = (key: string): Promise<void> => {
  const myBucket = String(process.env.BUCKET_NAME)
  const params = {
    Bucket: myBucket,
    Key: key,
  }
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export const getTime = () => {
  const date = new Date()
  const time = date.getTime()
  return time
}
