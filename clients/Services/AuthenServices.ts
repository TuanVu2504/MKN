import { Fetch } from './fetch'
import { IAuthedUser, IUserInfo } from '/project/shared'

export class AuthenServices {
  static login = function(username: string, password: string){
    return Fetch.fetch<IAuthedUser>(Fetch.baseUrl + "/api/auth/local", { 
      method: "POST",
      body: JSON.stringify({
        "identifier": username,
        password: password
      })
    })
  }
}

export class UserServices {
  static getUserByID(id: string|number){
    return Fetch.fetch<IUserInfo>(Fetch.baseUrl + "/api/users/" + id)
  }
}