import { IDBRequestActivity,
  IDBRequestCore, Optional, TRequestActivity
} from '/project/shared'
import { IDBUserInfo } from '/project/shared'


export interface IMKNRequest 
  extends Omit<IDBRequestCore, "parent" | "createdBy"| "requestID">, 
  Optional<IDBRequestCore, "requestID">
{
  createdBy: IDBUserInfo,
  parent?: IMKNRequest,
}

export interface IRequestActivity
  extends Omit<IDBRequestActivity, "handleBy"> {
  /** reference to IUserInfo.userID */
  handleBy: IDBUserInfo
}

export enum EState {
  'open' = 'open', 
  'closed'  = 'closed', 
  'completed' = 'completed'
}

export type TRequestState = `${EState}`

export type TRequestActionPayload = {
  action: TRequestActivity
  comment: string
}