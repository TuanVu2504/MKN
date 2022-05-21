import { IThingsCoordinate, IUser } from '.'

export interface ITask {
  requestID: string,
  requestBy: IUser,
  /** `Date` in miliseconds */
  deadLineAt?: string,
  requestAt: string,
}

export interface ISurveyBoxRequest extends IThingsCoordinate, ITask {}