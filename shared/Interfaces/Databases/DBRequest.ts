
export enum ERequestActivity {
  'activated' = 'activated',
  'assigned' = 'assigned',
  'change-assignee' = 'change-assignee',
  'closed' = 'closed',
  'comment' = 'comment',
  'completed' = 'completed',
  'delivered' = 'delivered',
  'delivering' = 'delivering',
  'disabled' = 'disabled',
  'hold' = 'hold',
  'open' = 'open',
  'preparing-item' = 'preparing-item',
  'reject' = 'reject',
  'stock' = 'stock',
  'used' = 'used',
  'waiting-assignee' = 'waiting-assignee'
}
export type TRequestActivity = `${ERequestActivity}`

export enum EMKNServiceType {
  'surveyLocation' = 'surveyLocation',
  'deployBox' = 'deployBox',
  'stock-stock' = 'stock-stock',
  'stock-user' = 'stock-user',
  'return-stock' = 'return-stock'
}
