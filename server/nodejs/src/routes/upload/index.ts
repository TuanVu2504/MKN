import { Router } from 'express'
import { ash } from '@Backend/helpers'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { EImageSize } from '/project/shared'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('/project/shared/assets/image') )
  },
  filename: (req,file, cb) => {
    const fileMineType = file.mimetype
    const imageId = uuid()
    const fileName = imageId 
                  + '_' 
                  + EImageSize.orginal
                  + '.' 
                  + path.extname(file.originalname) 
    console.log({ fileMineType, fileName })
    cb(null, fileName)
  }
})

const upload = multer({ storage }).single('test')

const router = Router()
router.route('/')
  .post(ash(async(req,res,next) => {
    upload(req, res, err => {
      if(err) {
        console.log(err)
      }
      const { file, files } = req
      console.log({ files, file })
      res.end(`uploaded`)
    })
  }))


export default router