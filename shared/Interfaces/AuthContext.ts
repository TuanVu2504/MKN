export interface IAuthContext {
  loading: boolean,
  login: (username: string, password: string) => void
  logout: () => void
  // verifyCookie: () => void,
  currentUser?: IUserInfo
  error:string[],
}

export interface IUserInfo {
  blocked: boolean,
  confirmed: boolean,
  /**@description yyyy-MM-ddTHH:mm:ss, conver to correct timezone by new Date(this) */
  createdAt: string,
  email: string,
  id: number,
  provider: "local"
  /**@description yyyy-MM-ddTHH:mm:ss, conver to correct timezone by new Date(this) */
  updatedAt: string
  username: string
}

export interface IAuthedUser {
  jwt: string,
  user: IUserInfo
}

export interface IAuthSigned {
  /** - uuid string */
  id: string
  userID: string
  /** - datetime miliseconds / 1000 */
  expiredAt: number
}