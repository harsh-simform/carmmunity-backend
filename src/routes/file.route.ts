import { app, upload } from '../index'
import {
  authMiddleware,
  fileRemoveFroms3Bucket,
  uploadToS3Bucket,
} from '../utils/helpers'
import { Request, Response } from 'express'

app.post(
  '/upload',
  authMiddleware,
  upload.single('avatar'),
  async (req: Request, res: Response) => {
    try {
      const { file } = req
      const { path } = req.body
      const fileUpload = await uploadToS3Bucket({
        bucketPath: path,
        file,
      })
      res.status(200).json({
        data: fileUpload,
      })
    } catch (e) {
      res.status(500).json({
        error: e,
      })
    }
  }
)

app.post('/upload', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { key, bucket } = req.body
    await fileRemoveFroms3Bucket(key, bucket)
    res.status(200).json({
      message: 'Success',
    })
  } catch (e) {
    res.status(500).json({
      error: e,
    })
  }
})
