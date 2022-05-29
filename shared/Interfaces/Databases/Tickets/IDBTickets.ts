import { IDBCoordinate, TFlags, IDBTicketItemList } from '/project/shared'

export enum ETicketType {
  'stock-stock' = 'stock-stock',
  'stock-user' = 'stock-user',
  'return-stock' = 'return-stock',
  'surveyLocation' = 'surveyLocation',
  'deployBox' = 'deployBox'
}
export type TTicketTypes = `${ETicketType}`

export interface IDBTicketTypes {
  ticketType: TTicketTypes,
  ticketTypeName: string,
}

export interface IDBTickets extends
  Pick<IDBTicketTypes, 'ticketType'>
{
  ticketId: string,
  /** - reference to `accounts`.`accountId` */
  requester: string,
  ticketState: TFlags,
  /** - refrence to `departments`.`departId` */
  queueHolder: string,
  /** - Reference to `accounts`.`accountId` */
  assignee: string
}

export interface IDBTicketsCreatePayload extends Pick<IDBTickets, "ticketType"> {}

export interface IDBTicketSurveyLocaiton extends 
  Pick<IDBTickets, "ticketId">,
  Pick<IDBCoordinate, "coordId">
{
  result?: string
}

export interface IDBTicketDeployBox extends
  Pick<IDBTickets, "ticketId">,
  Pick<IDBCoordinate, "coordId"> {}

export interface IDBTicketTransport extends 
  Pick<IDBTickets, "ticketId">, 
  Pick<IDBTicketItemList, "itemListId"> {}

export interface IDBTicketRequestStockItem extends
  Pick<IDBTickets, "ticketId">,
  Pick<IDBTicketItemList, "itemListId"> {}

export interface IDBTicketActivities extends 
  Pick<IDBTickets, "ticketId">

{
  /** - Reference to `accounts`.`accountId`, CHAR(36) */
  actionBy: string,
  updatedAt: string,
  sequence: number,
  actionPerformed: TFlags,
  comment?: string,
}

export interface IDBTicketLocation { 
  coordId: string,
  long: string, 
  latt: string
}

// export interface IDBItemList {
//   itemListId: string,
//   createdAt: string,
//   itemListState: TFlags
// }