import { TicketBase, UserModel } from '@Backend/models' 
import { EFlags, IDBStock } from '/project/shared'
export interface IResLocal {
  userContext: UserModel
}

export type TITemEventKeyParams<K extends EFlags> =
  K extends EFlags.delivered ? { receiver: UserModel} :
  K extends EFlags.delivering ? { shiper: UserModel } :
  K extends EFlags.stored ? { store: IDBStock } :
  K extends EFlags.used ? { ticket: TicketBase }
  : never 

export interface IItemEventListener {
  [EFlags.delivered]: (params: TITemEventKeyParams<EFlags.delivered>) => void,
  [EFlags.delivering]: (params: TITemEventKeyParams<EFlags.delivering>) => void,
  [EFlags.stored]: (params: TITemEventKeyParams<EFlags.stored>) => void
  [EFlags.used]: (params: TITemEventKeyParams<EFlags.used>) => void
}
