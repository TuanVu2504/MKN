import { User } from '@Backend/entity'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import config from '@Backend/config'
import { AuthError } from '@Backend/Error'


export class UserSerivces {
  public static signToken( user: User, duration:number = 3600000){
    const expiredAt = (new Date().getTime() + duration)
    const authObject = jwt.sign({ 
      id: uuid(),
      userId: user.userId,
      expiredAt
    }, config.jwt_key)
    return {
      token: authObject,
      duration: duration
    }
  }

  static async auth(identifier: string, password: string): Promise<User>{
    const user = await User.findOneBy({ userName: identifier })
    if(!user) 
      throw new AuthError("User not found")
    
    // check later
    return user
  }

  static async getUserById(identifier: string){
    return User.findOneBy({ email: identifier })
  }
}