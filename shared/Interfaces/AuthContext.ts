import { IDBUserInfo } from '/project/shared'
export interface IAuthContext {
  loading: boolean,
  login: (username: string, password: string) => void
  logout: () => void
  // verifyCookie: () => void,
  currentUser?: IDBUserInfo
  error:string[],
}

export interface IAuthedUser {
  jwt: string,
  user: IDBUserInfo
}

export interface IAuthSigned {
  /** - uuid string */
  id: string
  userID: string
  /** - datetime miliseconds / 1000 */
  expiredAt: number
}