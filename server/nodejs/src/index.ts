import express, { Response } from 'express'
import api from './routes'
import cookieParser from 'cookie-parser'
import { TAPIError } from '/project/shared'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({ path: '/project/.env'})

const server = express()
const port = process.env.API_PORT || 8001

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