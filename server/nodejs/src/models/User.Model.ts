import { IUserInfo, settings } from "/project/shared";
import { AuthError, ResourceError } from './error'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'

const testUser = (id: number, identifier: string): IUserInfo => {
  return  {
    blocked: false,
    confirmed: true,
    email: 'tuanvt@mekongnet.com.kh',
    id: id,
    username: identifier,
    provider: 'local',
    createdAt: new Date().getTime().toString(),
    updatedAt: new Date().getTime().toString()
  }
}

const defaultPassword = '12345ABCD!@#'
const test_users: [number, string][] = [[1, 'sale1'], [2, 'sale2']]

export class UserModel {
  props: IUserInfo
  constructor(props: IUserInfo){
    this.props = props
  }

  async setProps<K extends keyof IUserInfo>(props: K, value: IUserInfo[K] ){

  }

  /**
   * 
   * @param user 
   * @param duration - in miliseconds format
   */
  public signToken(duration:number = 3600000){
    const expiredAt = (new Date().getTime() + duration)
    const authObject = jwt.sign({ 
      id: uuid(),
      userID: this.props.id,
      expiredAt
    }, settings.jwt_key)
    return {
      token: authObject,
      duration: duration
    }
  }

  static async getUserByIdentifier(identifier: string){
    const user = test_users.find(u => u[1] == identifier)
    if(!user) 
      throw new ResourceError("User not found")

    return new UserModel(testUser(user[0], user[1]))
  }

  static async getUserByID(id: string|number){
    const user = test_users.find(u => u[0] == id)
    if(!user) 
      throw new ResourceError("User not found")

    return new UserModel(testUser(user[0], user[1]))
  }

  static async auth(identifier: string, password: string): Promise<UserModel>{
    const user = test_users.find(u => u[1] == identifier)
    if(!user) 
      throw new AuthError("User not found")
    if(password != defaultPassword) 
      throw new AuthError("Authenticate failed")

    return new UserModel(testUser(user[0], user[1]))
  }
}