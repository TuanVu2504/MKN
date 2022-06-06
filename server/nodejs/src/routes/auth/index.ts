import express from 'express'
import { ash, getTokenFromHeader } from '@Backend/helpers'
import jwt from 'jsonwebtoken'
import { 
  IAuthedUser, IUserLoginRequest, IAuthSigned, IUserDTO,
} from '/project/shared'
import { UserSerivces } from '@Backend/Services'
import { AuthError } from '@Backend/Error'
import config from '@Backend/config'
const router = express.Router()

router.route('/')
  .post(ash<{}, IAuthedUser, IUserLoginRequest>(async(req,res,next) => {
    const { identifier, password } = req.body
    const user = await UserSerivces.auth(identifier, password)
    const signed = UserSerivces.signToken(user)
    res.cookie( 
      config.auth_token_name, 
      signed.token, 
      { httpOnly: true, maxAge: signed.duration }
    )
    res.json({ user: user })
  }))
  .get(ash<{}, IUserDTO>(async(req,res,next) => {
    const token = getTokenFromHeader(req)
    if(!token){
      throw new AuthError("Authentication is required")
    }
    const decode = jwt.decode(token, { complete: true }).payload as IAuthSigned
    if(decode.expiredAt <= new Date().getTime()){
      throw new AuthError("Session expired")
    }
    const user = await UserSerivces.getUserById(decode.userID)
    res.json(user)
  }))
  .delete(ash(async(req,res,next) => {
    res.cookie(config.auth_token_name, '', { httpOnly: true, expires: new Date(1) })
    throw new AuthError("Logged out")
  }))

export default router