import { MKNDB } from '@Backend/database';
import { IDBCoordinate, IDBItems, IDBTicketItemList, 
  IDBTickets, EFlags, ETable,
} from '/project/shared'
import EventEmitter from 'events'
import { ItemSet, UserModel } from '@Backend/models'
import { MKNBase } from '../base';

export type TTicketEventKeyParams<K extends 'updated'> = 
  K extends 'updated' ? { by: UserModel, comment?:string, actionPerformed: EFlags }
  : never
export interface ITicketKeyListenHandler {
  'updated' (params: TTicketEventKeyParams<"updated">) : void,
}


export class TicketFactory {
  private static __store: TicketBase[]

  static async produce(ticket: IDBTickets){
    const savedTicket = TicketFactory.__store.find(tk => tk.ticketId == ticket.ticketId)
    if(savedTicket) return savedTicket
    let unSavedTicket = new TicketBase(ticket);
    TicketFactory.__store.push(unSavedTicket)
    return unSavedTicket
  }
}


export interface TicketBase extends IDBTickets {}
export class TicketBase extends MKNBase<IDBTickets> {
  private __events = new EventEmitter();
  public constructor(props: IDBTickets){
    super(props)
    this.on('updated', ({ by, actionPerformed, comment }) => {
      if(this.ticketState == EFlags.closed || this.ticketState == EFlags.completed){
        // throw TicketClosedError(this)
      }
      const now = new Date().getTime()
      MKNDB.Table(MKNDB.ETable.ticketActivities).select2({ filter: {
        ticketId: this.ticketId
      } }).then(res => {
        const sequence = res.length > 0 ? res.pop().sequence + 1 : 1
        return MKNDB.Table(MKNDB.ETable.ticketActivities).post([{
          ticketId: this.ticketId,
          actionBy: by.accountId,
          updatedAt: now.toString(),
          sequence,
          actionPerformed,
          comment,
        }])
      })
      
    })
  }

  on<K extends keyof ITicketKeyListenHandler>(e: K, handler: ITicketKeyListenHandler[K]){
    this.__events.on(e, handler)
  }

  emit<K extends keyof ITicketKeyListenHandler>(e: K, params: TTicketEventKeyParams<K>){
    this.__events.emit(e, params)
  }

  async asTicketLocation(){
    const coordOfTicket = await MKNDB.staticQuery.getCoordOfTicket(this)
    if(!coordOfTicket) {
      // throw RequiredParameterError here
    }
    return new TicketLocation(this, coordOfTicket)
  }

  async asTicketDeployBox(){
    // const coordOfTicket = await MKNDB.staticQuery.getCoordOfTicket(this)
    const ticketLocation = await this.asTicketLocation();
    const dbItemSet = await MKNDB.staticQuery.getItemSetOfTicket(this)
    if(!dbItemSet){
      // throw RequiredParameterError here
    }
  }
}

export class TicketLocation extends TicketBase {
  coord: IDBCoordinate;
  constructor(props: IDBTickets, coord: IDBCoordinate){
    super(props)
    this.coord = coord
  }
}


export class TicketDeployBox extends TicketLocation {
  itemSet: string
  itemList: IDBTicketItemList[]
  items: IDBItems[]
  constructor(props: TicketLocation, itemSet: ItemSet){
    super(props, props.coord)
    
  }

  static createTicket(){

  }
}


export class TicketSurveyLocation extends TicketBase {

  static createTicket(){
    
  }
}


export class TicketTransport extends TicketBase {

  static createTicket(){
    
  }
}



export class TicketRequestStockItems extends TicketBase {

  static createTicket(){
    
  }
}

type TTicket = TicketDeployBox | TicketTransport |TicketSurveyLocation | TicketRequestStockItems



