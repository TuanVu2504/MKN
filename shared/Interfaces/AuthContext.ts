import { IUserDTO } from '/project/shared'
export interface IAuthContext {
  loading: boolean,
  login: (username: string, password: string) => void
  logout: () => void
  // verifyCookie: () => void,
  currentUser?: IUserDTO
  error:string[],
}

export interface IAuthedUser {
  user: IUserDTO
}

export interface IAuthSigned {
  /** - uuid string */
  id: string
  userID: string
  /** - datetime miliseconds / 1000 */
  expiredAt: number
}