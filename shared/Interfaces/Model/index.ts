import { IDBUsers, IDBRole, IDBPermissions, EFlags, TFlags } from '/project/shared'

export interface IUserModel extends IDBUsers {
  roles: (IDBRole & { permissions: IDBPermissions[] })[]
}