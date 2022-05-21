import express from 'express'
import { ash, getTokenFromHeader } from '@Backend/helpers'
import jwt from 'jsonwebtoken'
import { 
  IAuthedUser, IUserLoginRequest, IAuthSigned,
  settings, IUserInfo 
} from '/project/shared'
import { AuthError, UserModel } from '@Backend/models'
const router = express.Router()

router.route('/')
  .post(ash<{}, IAuthedUser, IUserLoginRequest>(async(req,res,next) => {
    const { identifier, password } = req.body
    const user = await UserModel.auth(identifier, password)
    const signed = user.signToken()
    res.cookie( 
      settings.auth_token_name, 
      signed.token, 
      { httpOnly: true, maxAge: signed.duration }
    )
    res.json({ jwt: signed.token, user: user.props })
  }))
  .get(ash<{}, IUserInfo>(async(req,res,next) => {
    const token = getTokenFromHeader(req)
    if(!token){
      throw new AuthError("Authentication is required")
    }
    const decode = jwt.decode(token, { complete: true }).payload as IAuthSigned
    if(decode.expiredAt <= new Date().getTime()){
      throw new AuthError("Session expired")
    }
    const user = await UserModel.getUserByID(decode.userID)
    res.json(user.props)
  }))
  .delete(ash(async(req,res,next) => {
    res.cookie(settings.auth_token_name, '', { httpOnly: true, expires: new Date(1) })
    throw new AuthError("Logged out")
  }))

export default router