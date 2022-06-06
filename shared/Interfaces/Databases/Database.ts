export enum EHolderType {
  'user' = 'user',
  'stock'= 'stock',
  'ticket' = 'ticket'
}
export type THolderType = `${EHolderType}`

export enum ETable {
  'categories' = 'categories',
  'flags' = 'flags',
  'stock' = 'stock',
  'stockItem' = 'stockItem',
  'userItem' = 'userItem',
  'ticketItem' = 'ticketItem',
  'items' = 'items',
  'itemList' = 'itemList',
  'ticketActivities' = 'ticketActivities',
  'ticketTypes' = 'ticketTypes',
  'tickets' = 'tickets',
  'accounts' = 'accounts',
  'images' = 'images',
  'coordinates' = 'coordinates',
  'users' = 'users',
  'departments' = 'departments',
  'positions' = 'positions',
}
export type DBTables = `${ETable}`