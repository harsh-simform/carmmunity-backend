import { server } from './server'
import express, { RequestHandler } from 'express'
import http from 'http'
import multer from 'multer'

const PORT = process.env.PORT || 4002

export const app = express()

app.use(express.json() as RequestHandler)
app.use(express.urlencoded({ extended: false }) as RequestHandler)
export const upload = multer({ dest: 'uploads/' })

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
