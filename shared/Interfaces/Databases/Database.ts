
import {  
  IDBItems, IDBTicketItemList,
  TFlags, IDBTickets, IDBCoordinate, IDBItemList,
  IDBUsers, IDBAccounts, oneOf, IDBTicketActivities, 
} from '/project/shared'

export interface IOperationDBRes {
  fieldCount: number,
  /**@description number of rows affected by command */
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  /**@description number of rows changed by command UPDATE*/
  changedRows: number,
}

export enum ETable {
  'ticketRequestStockItems' = 'ticketRequestStockItems',
  'ticketTransport' = 'ticketTransport', 
  'ticketItem' = 'ticketItem',
  'itemList' = 'itemList',
  'ticketItemList' = 'ticketItemList',
  'items' = 'items',
  'ticketLocation' = 'ticketLocation',
  'ticketActivities' = 'ticketActivities',
  'ticketTypes' = 'ticketTypes',
  'tickets' = 'tickets',
  'accounts' = 'accounts',
  'coordinates' = 'coordinates',
  'users' = 'users',
  'departments' = 'departments',
  'positions' = 'positions',
}
export type DBTables = `${ETable}`
export type ReturnTableType<T extends DBTables> =
  T extends ETable.users ? IDBUsers :
  T extends ETable.items ? IDBItems :
  T extends ETable.accounts ? IDBAccounts :
  T extends ETable.positions ? IDBPosition :
  T extends ETable.ticketActivities ? IDBTicketActivities :
  T extends ETable.tickets ? IDBTickets :
  T extends ETable.ticketItemList ? IDBTicketItemList :
  T extends ETable.coordinates ? IDBCoordinate :
  T extends ETable.itemList ? IDBItemList
  : never

export type MysqlMethods = "SELECT" | "INSERT" | "UPDATE" | "DELETE"

export type IMysqlFilter<T extends DBTables> = Partial<ReturnTableType<T>> | Partial<ReturnTableType<T>>[]
export type IMysqlInsertOption<T extends DBTables> = Partial<ReturnTableType<T>>
export type IMysqlSelectOption<T extends DBTables> = Partial<ReturnTableType<T>>
export type IMysqlDeleteOption<T extends DBTables> = IMysqlFilter<T>   // ReturnIdentidy<T>
export type IMysqlUpdateOption<T extends DBTables> = {
  update: Partial<ReturnTableType<T>>
  filter?: { [k in keyof ReturnTableType<T>]?: string }
}
export type MySqlOption<M extends MysqlMethods,T extends DBTables> = 
  M extends "SELECT" ? IMysqlSelectOption<T> :
  M extends "INSERT" ? IMysqlInsertOption<T> :
  M extends "UPDATE" ? IMysqlUpdateOption<T> :
  M extends "DELETE" ? IMysqlDeleteOption<T> :
  never


export type MySqlReturn<M extends MysqlMethods, T extends DBTables> = 
  M extends "SELECT" ? ReturnTableType<T>[] : IOperationDBRes

export interface IQuery<T extends DBTables> {
  source: {
    table: T,
    partition?:string
  }
}
export interface ISelectOption<T extends DBTables> extends IQuery<T>{
  method: "SELECT",
  option?: IMysqlSelectOption<T>
} 
export interface IUpdateOption<T extends DBTables> extends IQuery<T>{
  method: "UPDATE"
  option: IMysqlUpdateOption<T>
}
export interface IDeleteOption<T extends DBTables> extends IQuery<T>{
  method: "DELETE"
  /**
   * @description
   * - If `Array` => filter `OR`
   * - If `Object` => filter `AND`
   * 
   * @example
   * option:{
   *    code_staff:"00124296",
   *    mail_opn:"tuan.vu@opennet.com.kh"
   * } 
   * return `code_staff="00124296" AND mail_opn="tuan.vu@opennet.com.kh"`
   * 
   * option:[{
   *    code_staff: "00124296",
   *    mail_opn:"tuan.vu@opennet.com.kh"
   * },{
   *    code_staff:"99999999",
   *    mail_opn:"lau.cao@opennet.com"
   * }]
   * return `(code_staff:"00124296", mail_opn:"tuan.vu@opennet.com.kh") OR (code_staff:"99999999", mail_opn:"lau.cao@opennet.com.kh")`
   */
  option: IMysqlFilter<T>
}
export interface IInsertOption<T extends DBTables> extends IQuery<T>{
  method: "INSERT"
  option: Partial<ReturnTableType<T>>[]
}
export type IMySqlQueConf<T extends DBTables> = ISelectOption<T> | IUpdateOption<T> | IDeleteOption<T> | IInsertOption<T>

export interface IDBDepartments {
  departId: string,
  departName: string,
  departCode: string,
  departState: TFlags,
}

export interface IDBPosition {
  posId: string,
  posName: string,
  posCode: string,
}

export type TMysqlCompareOperators = "=" | ">=" | "<=" | "<" | ">"
export type TSQLFilter<TBT, U = oneOf<TBT>> = 
  oneOf<TBT> 
  & { compare?: TMysqlCompareOperators } 
  | { operator: "AND" | "OR", values: Array<U & { compare?: TMysqlCompareOperators }> }


export interface ISQLQuery2<TBT> {
  top?: number,
  order?: { by: keyof TBT, dir?: "DESC" | "ASC" }
  filter?: TSQLFilter<TBT>,
  props?: (keyof TBT)[]
}