import { IDBItemSet, IDBTicketItemList, IDBItems, EFlags } from '/project/shared'
import { MKNBase } from '@Backend/models';
import EventEmitter from 'events'
import { IItemEventListener, TITemEventKeyParams } from '@Backend/Interface';
import { MKNDB } from '@Backend/database';

export interface ItemSet extends IDBItemSet {}
export class ItemSet extends MKNBase<IDBItemSet> {
  itemList: TicketItemList[]
  constructor(props: IDBItemSet, itemList: TicketItemList[]){
    super(props)
    this.itemList = itemList
  }

  getItems(){
    return this.itemList
            .map(l => l.getItems())
            .flat()
  }
}

export interface TicketItemList extends IDBTicketItemList {}
export class TicketItemList extends MKNBase<IDBTicketItemList> 
{
  items: Item[]
  constructor(props: IDBTicketItemList, items: Item[]){
    super(props)
    this.items = items
  }

  assignItem(item: Item){
    // write to database
    this.items.push(item)
  }

  removeItem(item: Item){
    this.items = this.items.filter(i => i.itemId == item.itemId)
  }

  getItems(){
    return this.items
  }
}

export interface Item extends IDBItems {}
export class Item extends MKNBase<IDBItems> 
{
  private __events = new EventEmitter()
  constructor(props: IDBItems){
    super(props)
    this.on(EFlags.used, ({ ticket }) => {
      MKNDB.Table(MKNDB.ETable.items)
        .update({ update: { 
          holderType: 'ticket',
          holderId: ticket.ticketId 
        }, where: { 
          itemId: this.itemId
        }})
    })

    this.on(EFlags.delivered, ({ receiver }) => {
      MKNDB.Table(MKNDB.ETable.items)
        .update({ update: { 
          holderType: 'user',
          holderId: receiver.accountId
        }, where: { 
          itemId: this.itemId
        }})
    })

    this.on(EFlags.delivering, ({ shiper }) => {
      MKNDB.Table(MKNDB.ETable.items)
        .update({ update: { 
          holderType: 'user',
          holderId: shiper.accountId
        }, where: { 
          itemId: this.itemId
        }})
    })

    this.on(EFlags.stored, ({ store }) => {
      MKNDB.Table(MKNDB.ETable.items)
        .update({ update: { 
          holderType: 'stock',
          holderId: store.stockId
        }, where: { 
          itemId: this.itemId
        }})
    })
  }

  private on<K extends keyof IItemEventListener>(
    e: K, 
    handler: IItemEventListener[K]
  ){
    this.__events.on(e, handler)
    return this
  }
  emit<K extends keyof IItemEventListener>(
    e: K, 
    params: TITemEventKeyParams<K>
  ){
    this.__events.emit(e, params)
  }

  private off<K extends keyof IItemEventListener>(
    e: K,
    params: IItemEventListener[K]
  ){
    this.__events.off(e, params)
  }
}