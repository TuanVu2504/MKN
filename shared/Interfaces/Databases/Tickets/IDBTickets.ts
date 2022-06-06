export enum ETicketType {
  'stock-stock' = 'stock-stock',
  'stock-user' = 'stock-user',
  'return-stock' = 'return-stock',
  'surveyLocation' = 'surveyLocation',
  'deployBox' = 'deployBox'
}
export type TTicketTypes = `${ETicketType}`
