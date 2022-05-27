import { IDBDepartments, IDBPosition } from '/project/shared'
import { TFlags } from '/project/shared'


export interface IDBAccounts {
  accountId: string,
  displayName: string,
  accountState: TFlags,
  accountType: 'system'|'user'
}

export interface IDBUsers extends 
  Pick<IDBAccounts, "accountId">,
  Pick<IDBDepartments, "departId">,
  Pick<IDBPosition, "posId">
{
  userName: string,
  email?:string,
  userId: string,
}

export interface IDBRole {
  roleId: string,
  roleName: string
}

export interface IDBAccountRole extends 
  Pick<IDBAccounts, "accountId">, Pick<IDBRole,"roleId"> {}

export interface IDBRolePermissions extends 
  Pick<IDBRole, "roleId">, Pick<IDBPermissions, "permissionId"> {}

export interface IDBPermissions {
  permissionId: string,
  resource: string,
  GET: string,
  PUT: string,
  POST: string,
  DELETE: string
}