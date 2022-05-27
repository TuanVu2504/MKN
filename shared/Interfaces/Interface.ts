// import { IDBCoordinate } from '/project/shared'

// // GENERIC

// export interface ICreatable {
//   /** - string represent date in miliseconds */
//   createdAt: string
//   createdBy: IDBUserInfo
// }

export type TAPIError = {
  data: null, 
  error: {
    status: number,
    name: string,
    message: string,
    details: TErrorDetail
  }
}

export type TErrorDetail = {}
  | { errors: { path: string[], name: string, message: string }[] }

export type IMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | "ALL"
export type IResource = 'page' | 'category' | 'user' | 'customer' | 'contract' | 'ticket' | 'ALL'
  
// interface IPassword {

// }


// // CUSTOMER
// export interface ICustomer {

// }

// // USER
// export interface IRole {
//   /** - Generate by uuid */
//   roleID: string
// }

// export interface IRolePermission extends IRole {
//   permissions: TPermission[]
// }

// export interface IPermission {
//   /** - Generate by uuid */
//   permissionID: string,
//   resource: IResource
//   /** 
//    * sub thing in `content` 
//    * - page may have 'admin_page' | 'role_page' 
//    * -  
//    */
//   resourceID?: string
//   method: IMethod
// }

// export type TPermission = IPermission

// export interface IUserRole extends IDBUserInfo {
//   role: IRolePermission
// }



// // // DEVICES
// // export interface IL2NetworkDevice extends INetworkDevice {
// //   ipMgmt: string,
// // }
// //// DEVICE ELEMENTS
// export type TPortType = "rj45" | "rs232" | "optic"

// export interface IPort {
//   portIndex: number,
//   description: string,
//   to: object
//   portType: TPortType
// }

// //// BOX
// // export interface IBox extends INetworkDevice {
  
// // }


// // MAP
// export interface IMapProps {
//   children?: any,
// }

// export interface IViewCoordinate {
//   /**
//    * - index 0 - latt
//    * - index 1 - long
//    */
//   coordinate: IDBCoordinate
// }


// // END

export enum EFlags { 
  'waiting_assignee' = 'waiting_assignee',
  'delivering' = 'delivering',
  'delivered' = 'delivered',
  'assigned' = 'assigned',
  'change_assignee' = 'change_assignee',
  'preparing_item' = 'preparing_item',
  'reject' = 'reject',
  'activated' = 'activated',
  'disabled' = 'disabled',
  'open' = 'open',
  'closed' = 'closed',
  'completed' = 'completed',
  'commemt' = 'commemt',
  'stock' = 'stock',
  'used' = 'used',
  'hold' = 'hold',
  'stored' = 'stored'
}
export type TFlags = `${EFlags}`
export type TDBFlags = { [k in TFlags]: TFlags } & { flagDescription: string }

