import { Fetch } from './fetch'
import { IAuthedUser, IUserDTO } from '/project/shared'

export class AuthenServices {
  static login = function(username: string, password: string){
    return Fetch.doFetch<IAuthedUser>(Fetch.baseUrl + "/api/auth", { 
      method: "POST",
      body: JSON.stringify({
        "identifier": username,
        password: password
      })
    })
  }

  static async verifyHTTPCookieToken(){
    return Fetch.doFetch<IUserDTO>(Fetch.baseUrl + "/api/auth")
  }

  static async logout(){
    return Fetch.doFetch<IUserDTO>(Fetch.baseUrl + "/api/auth", { 
      method: 'DELETE'
    })
  }
}

export class UserServices {
  static getUserByID(id: string|number){
    return Fetch.doFetch<IUserDTO>(Fetch.baseUrl + "/api/users/" + id)
  }

}