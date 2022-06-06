import { AppDataSource } from "./data-source"
import express, { Response } from 'express'
import api from './routes'
import cookieParser from 'cookie-parser'
import { TAPIError, EFlags } from '/project/shared'
import cors from 'cors'
import config from './config'

const server = express()
const port = config.apiport || 8001

AppDataSource.initialize().then(async init => {
  // init.synchronize()
  server.use(express.urlencoded({ extended: true }))
  server.use(express.json())
  server.use(cookieParser())
  server.use(cors({
    origin: [
      'https://file.mekongnet.com.kh:8002'
    ],
    credentials: true,
  }));

  server.use('/api', api)

  server.use((err: TAPIError|Error, req, res: Response<TAPIError>, next) => {
    if("data" in err){
      res.status(err.error.status||500).json(err)
    } else {
      // 500 error
      console.log(err)
      res.status(500).json({
        data: null, error: {
          details: {},
          name: err.name || 'ServerFail',
          status: 500,
          message: err.message || 'Internal Server Error'
        }
      })
    }
  });

  server.listen(port, () => {
    console.log(`server is running on port ${port}`)
  })
})