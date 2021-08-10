import { server } from './server'
import express, { RequestHandler } from 'express'
import http from 'http'
import multer from 'multer'
import cors from 'cors'
import {
  authMiddleware,
  fileRemoveFroms3Bucket,
  uploadToS3Bucket,
} from './utils/helpers'
import { Request, Response } from 'express'

const PORT = process.env.PORT || 4002

export const app = express()

app.use(cors())
app.use(express.json() as RequestHandler)
app.use(express.urlencoded({ extended: false }) as RequestHandler)
export const upload = multer({ dest: 'uploads/' })

app.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { file } = req
      const { path } = req.body
      const fileUpload = await uploadToS3Bucket({
        bucketPath: path,
        file,
      })
      res.status(200).json({
        message: 'Success',
        data: fileUpload,
      })
    } catch (e) {
      res.status(500).json({
        error: e,
      })
    }
  }
)

app.post('/remove', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { key } = req.body
    await fileRemoveFroms3Bucket(key)
    res.status(200).json({
      message: 'Success',
    })
  } catch (e) {
    res.status(500).json({
      error: e,
    })
  }
})

server.start()

server.applyMiddleware({
  app,
  path: '/',
  cors: { credentials: true, origin: '*' },
})

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  )
})
