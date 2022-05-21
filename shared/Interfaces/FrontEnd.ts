import { IBox, ISurveyBoxRequest, IThingsCoordinate, IUser } from '.'

export interface IDeployedBox extends IBox, ISurveyBoxRequest, IThingsCoordinate {
  deployedBy: IUser,
  deployedAt: string
}