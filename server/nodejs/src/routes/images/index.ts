import { Router } from 'express'
import { ash } from '@Backend/helpers'
import { Image } from '@Backend/entity'
import * as core from 'express-serve-static-core'
import fs from 'fs'
import { TImageSize } from '/project/shared'
import { ResourceNotFoundError } from '@Backend/Error'

const router = Router()

router.route('/')
  .get(ash(async(req,res,next) => {

  }))

  .post(ash(async(req,res,next) => {

  }))

interface IImageQuery { size: TImageSize }
router.route('/:imageId')
  .get(ash(async(
    req: core.Request<{ imageId: string}, any, any, IImageQuery>,
    res,
    next
  ) => {
    const { imageId } = req.params
    const { size } = req.query
    const image = await Image.findOneByOrFail({ imageId })
    const imageContentStream = fs.createReadStream(image[size])
    imageContentStream.on("error", err => { 
      throw new ResourceNotFoundError(err.message, 404 ) })
    
    imageContentStream.on("open", () => {
      res.set('Content-Type', 'image/jpeg');
      imageContentStream.pipe(res);
    })
  }))

export default router