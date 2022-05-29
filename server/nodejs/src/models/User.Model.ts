import {  
  // ETable, IDBCategories, IDBTickets, 
  IDBUsers,
  IUserModel,
  //  IDBTicketsCreatePayload, EFlags, IDBItems
} from "/project/shared";
import { MKNDB } from '@Backend/database'
import { AuthError, ResourceNotFoundError, 
  TicketAuthorizeError, ItemOwnerError 
} from '@Backend/Error'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
// import { MKNBase, TicketBase, TicketFactory, 
//   Item 
// } from '@Backend/models'

const testUser = (id: string, identifier: string): IUserModel => {
  return  {
    accountId: 'none',
    email: 'tuanvt@mekongnet.com.kh',
    userId: id,
    userName: identifier,
    departId: '1',
    posId: '1',
    roles: [{
      roleId: '12', roleName: "supper god",
      permissions: []
    }]
  }
}

const defaultPassword = '12345ABCD!@#'
const test_users: [string, string][] = [['1', 'sale1'], ['2', 'sale2']]

export interface UserModel extends IUserModel {}
export class UserModel 
  // extends MKNBase<IDBUsers> 
  implements IDBUsers
  {
  constructor(props: IUserModel){
    // super(props)
    Object.assign(this, props)
  }

  public toJSON(){ 
    return Object.entries(this)
    .reduce((a,[k,v]) => typeof v !== "function" ? Object.assign(a, { [k]: v }) : a , {}) as IUserModel
  }

  // async setProp<K extends keyof IDBUsers>(key: K, value: IDBUsers[K] ){
  //   Object.assign(this, { [key]: value })
  //   this.__constructor[key] = value
  //   MKNDB.Table(MKNDB.ETable.users).update({
  //     where: { accountId: this.accountId },
  //     update: { [key]: value }
  //   })
  // }

  // async performRequest(ticket: TicketBase) {
  //   // check if user relate to the request and at his phase
  //     // => perform it
  //   // else reject 403
  // }

  // async confirmTicket(ticket: TicketBase, comment?: string){
  //   const ticketActivities = await this.checkTicketActivities(ticket)
  //   await this.isManagerOf(this.departId)
  //   if(ticketActivities.length > 0 
  //     && ticketActivities.pop().actionPerformed == EFlags.require_confirm)
  //   {
  //     ticket.emit(EFlags.confirm, { by: this, comment })
  //   } else {
  //     // throw TicketSequenceError
  //   }
  // }

  // private async checkTicketSequence(ticket: TicketBase, action: EFlags){
    
  // }

  // async checkTicketActivities(ticket: TicketBase){
  //   this.isAssociatedTo(ticket)
  //   const ticketActivities = await MKNDB.Table(MKNDB.ETable.ticketActivities).select2({
  //     filter: { ticketId: ticket.ticketId }
  //   })
  //   return ticketActivities
  // }

  // public async isManagerOf(departId: string): Promise<boolean>{
  //   const pos = await MKNDB
  //           .Table(ETable.positions).select2({ filter: { posId: this.posId }})
  //           .then(poss => poss.find(pos => pos.posId == this.posId))
  //   if(pos && pos.posCode.toLowerCase() == 'mgr' && this.departId == departId) return true
  //   return false
  // }

  // async getItem(itemId: string): Promise<Item> {
  //   const item = await MKNDB.staticQuery
  //                             .getMyItem(this)
  //                             .then(items => 
  //                               items.find(item => 
  //                                 item.itemId == itemId))
  //   if(!item){
  //     throw new ItemOwnerError(itemId)
  //   }
  //   return Item.getItem(itemId)
  // }

  // async attachItemToTicket(ticket: TicketBase, items: IDBItems[]){
  //   this.isAssociatedTo(ticket)
  // }


  // public async rejectTicket(ticket: TicketBase, reason: string){
  //   this.isAssociatedTo(ticket)
  //   this.isManagerOf(this.departId)
  //   ticket.emit(EFlags.reject, { by: this, comment: reason })
  // }

  // public async isTicketManager(): Promise<boolean>{
  //   return this.roles.some(r => r.roleId == 'queue-manager')
  // }

  // public closeTicket(ticket: TicketBase, reason?: string){
  //   // rest logic
  // }

  // public requestStockDevice(itemCategory: IDBCategories){
    // chek if device number is available in stock
      // => perform add to table ticket
      // => perform add to table ticketRequestStockItems
    
    // else reject 404 StockCategoryEmpty
  // }

  /**
   * - Ticket Manager => Return all
   * - Requester => Return ticket from his.departmentId or to his.departmentId
   * - OR manager of requester
   * - OR queueHolder
   *
   */
  // public async getTickets(){
  //   //none filter is applied
  //   let query = 
  //   `
  //   SELECT tks.*, ticketCoord.latt, ticketCoord.long FROM ${MKNDB.ETable.tickets} tks LEFT JOIN ( \
  //   SELECT tks.ticketId, coord.latt, coord.long FROM ${MKNDB.ETable.ticketLocation} tks LEFT JOIN \
  //   ${MKNDB.ETable.coordinates} coord on coord.coordId = tks.coordId
  //   ) ticketCoord on ticketCoord.ticketId = tks.ticketId' \
    
  //   `

  //   if(this.isTicketManager()){
  //     // keep the query => all tickets
  //   } else if(this.isManagerOf(this.departId)){ 
  //     // manager => get all ticket created by staff.departId = manager.departId
  //     query += 
  //     ` 
  //     WHERE tks.requester IN (SELECT accountId FROM \`${MKNDB.ETable.users}\` u WHERE u.departId='${this.departId}') 
  //     OR (tks.ticketType IN (SELECT ticketType FROM ${MKNDB.ETable.ticketTypes} WHERE ticketTypeHolder = '${this.departId}'))
  //     `
  //   } 
  //   else 
  //   { 
  //     // context is requester or ( ticket.ticketType belong to thisAccount.departId )
  //     query += 
  //     `
  //     WHERE tks.requester='${this.accountId}' 
  //     OR (tks.ticketType IN (SELECT ticketType FROM ${MKNDB.ETable.ticketTypes} WHERE ticketTypeHolder = '${this.departId}'))
  //     `
  //   }

  //   query = query.replace(/\s{2,}/ig, ' ')
  //   console.log({ query })
  //   return MKNDB.query(query.replace(/\s{2,}/ig, ' ')) as Promise<(IDBTickets & { latt?: string, long?:string })[]>
  // }

  // public async getTicket(ticketId: string){
  //   const ticket = await MKNDB
  //                       .Table(ETable.tickets)
  //                       .select2({ filter: { ticketId }})
  //                       .then(res => res[0])
  //   if(!ticket) 
  //     throw new ResourceNotFoundError(`Can not find any ticket with id: ${ticketId}`, 404)
    
  //   const newTicket = await TicketFactory.produce(ticket)
  //   await this.isAssociatedTo(newTicket)
  //   return newTicket
  // }

    // private async isAssociatedTo(ticket: TicketBase){
  //   const isAssociatedToTicket = this.getTickets().then(res => 
  //     res.filter(tk => 
  //       tk.ticketId == ticket.ticketId
  //     ).length > 0)
  //   if(!isAssociatedToTicket) 
  //     throw new TicketAuthorizeError(ticket.ticketId, 'GET')
  // }

  // public async getTicketActivities(ticket: TicketBase){
  //   this.isAssociatedTo(ticket)
  //   return MKNDB.Table(ETable.ticketActivities).select2({ filter: { ticketId: ticket.ticketId }})
  // }

  // /** - To update activity */
  // public createRequest(ticket: IDBTicketsCreatePayload){

  // }

  /**
   * 
   * @param user 
   * @param duration - in miliseconds format
   */
    public static signToken( user: UserModel, duration:number = 3600000){
    const expiredAt = (new Date().getTime() + duration)
    const authObject = jwt.sign({ 
      id: uuid(),
      userId: user.userId,
      expiredAt
    }, process.env.jwt_key)
    return {
      token: authObject,
      duration: duration
    }
  }


  static async getUserByIdentifier(identifier: string){
    const user = test_users.find(u => u[1] == identifier)
    if(!user) 
      throw new ResourceNotFoundError("User not found")

    return new UserModel(testUser(user[0], user[1]))
  }

  static async getUserByID(id: string|number){
    const user = test_users.find(u => u[0] == id)
    if(!user) 
      throw new ResourceNotFoundError("User not found")

    return new UserModel(testUser(user[0], user[1]))
  }

  static async auth(identifier: string, password: string): Promise<UserModel>{
    const user = test_users.find(u => u[1] == identifier)
    if(!user) 
      throw new AuthError("User not found")
    if(password != defaultPassword) 
      throw new AuthError("Authenticate failed")

    return new UserModel(testUser(user[0], user[1]))
  }
}