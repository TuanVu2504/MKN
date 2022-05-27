import { IBox, IViewCoordinate, IDBUserInfo, IDeployBoxRequest } from '/project/shared'

export interface IDeployedBox extends IBox, IDeployBoxRequest, IViewCoordinate {
  deployedBy: IDBUserInfo,
  deployedAt: string,
}