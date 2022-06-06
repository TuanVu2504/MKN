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

export enum EAccountType  { 'system' = 'system', 'user' = 'user' }
export type TAccountType = `${EAccountType}`

export enum EImageSize { 
  'thumbnail' = 'thumbnail', 
  'small' = 'small', 
  'medium' = 'medium', 
  'large' = 'large', 
  'orginal' = 'orginal' 
}
export type TImageSize = `${EImageSize}`

export enum EFlags { 
  'waiting_assignee' = 'waiting_assignee',
  'delivering' = 'delivering',
  'delivered' = 'delivered',
  'assigned' = 'assigned',
  'change_assignee' = 'change_assignee',
  'preparing_item' = 'preparing_item',
  'reject' = 'reject',
  'rejected' = 'rejected',
  'activated' = 'activated',
  'disabled' = 'disabled',
  'open' = 'open',
  'create' = 'create',
  'created' = 'created',
  'close' = 'close',
  'closed' = 'closed',
  'completed' = 'completed',
  'comment' = 'comment',
  'stock' = 'stock',
  'used' = 'used',
  'hold' = 'hold',
  'stored' = 'stored',
  'confirm' = 'confirm',
  'confirmed' = 'confirmed',
  'require_confirm' = 'require_confirm'
}
export type TFlags = `${EFlags}`
export type TDBFlags = { [k in TFlags]: TFlags } & { flagDescription: string }

