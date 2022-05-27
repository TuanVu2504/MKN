// import { IDBRequestCore, IDBCoordinate, TRequestActivity, TRequestState } from '/project/shared'
// import { UserModel } from '../User.Model'
// import { MKNDB } from '@Backend/database'
// import { ParamRequiredError, ResourceNotFoundError } from '@Backend/Error'
// import EventEmitter from 'events'

// export class RequestModel {

//   static async addRequest(request: Omit<IDBRequestCore, "requestID">): Promise<IDBRequestCore> {
//     const { insertId } = await MKNDB.Table("requests").post([request])
//     return { ...request, requestID: insertId.toString() }
//   }

//   static async getRequest(params: { [k in keyof IDBRequestCore]?: IDBRequestCore[k] }) : Promise<IDBRequestCore[]> {
//     return MKNDB.Table("requests").select(params)
//   }

//   static async getRequestById(requestID: string, options: { state?: TRequestState }):Promise<IDBRequestCore| undefined>{
//     return MKNDB.Table("requests").select({
//       requestID, 
//       state: options && options.state ? options.state : undefined
//     }).then(res => res[0])
//   }

//   static async getRequests(userContext: UserModel): Promise<IDBRequestCore[]>{
//     // manager?
//       // request to, from mystaff
//       // request need my approval
//       // request from me
//       // 

//     // request from me
//       // request to my department queue
//     // 
//     // return MKNDB.Table("requests").select()
//   }

//   static requireParams(variable: Record<string, string>){
//     const [[varname, varval]] = Object.entries(variable)
//     if(varval == undefined || varval == null || varval == '') throw new ParamRequiredError(varname)
//     return varval
//   }
//   static async findRequestOrError(requestID: string, option?: { state?: TRequestState }) {
//     const request = await RequestModel.getRequestById(requestID, option)
//     if(!request) throw new ResourceNotFoundError(`Request with ${requestID} not found`, 404)
//     return request
//   }

// }

// export class RequestCoordModel {

//   static async add(request: IDBRequestCore, coord: IDBCoordinate){
//     // add
//   }
// }

// type IRequestUpdateHandlerParams = {
//   userContext: UserModel, request: IDBRequestCore, comment?:string }

// type IRequestUpdateEventHandler = 
//   { [k in TRequestActivity]: (params: IRequestUpdateHandlerParams) => void }


// interface IRequestUpdateEvent {
//     // matches EventEmitter.on
//     on<U extends keyof IRequestUpdateEventHandler>(event: U, listener: IRequestUpdateEventHandler[U]): this;
    
//     // matches EventEmitter.off
//     off<U extends keyof IRequestUpdateEventHandler>(event: U, listener: IRequestUpdateEventHandler[U]): this;
    
//     // matches EventEmitter.emit
//     emit<U extends keyof IRequestUpdateEventHandler>(
//         event: U,
//         args: IRequestUpdateEventHandler[U]
//     ): boolean;
// }

// class RequetUpdateEvent extends EventEmitter implements IRequestUpdateEvent {
//   private __emitter = new EventEmitter()
//   on<U extends keyof IRequestUpdateEventHandler>(event: U, listener: IRequestUpdateEventHandler[U]): this {
//     this.__emitter.on(event, listener)
//     return this
//   }

//   // matches EventEmitter.off
//   off<U extends keyof IRequestUpdateEventHandler>(event: U, listener: IRequestUpdateEventHandler[U]): this {
//     this.__emitter.off(event, listener)
//     return this
//   }

//       // matches EventEmitter.emit
//   emit<U extends keyof IRequestUpdateEventHandler>(
//     event: U,
//     args: IRequestUpdateEventHandler[U]
//   ): boolean {
//     return this.__emitter.emit(event, args)
//   }

  
// }

// const requestUpdateEvent = new RequetUpdateEvent()
// requestUpdateEvent.on('close', params => {

// })
// requestUpdateEvent.on('confirm', params => {
  
// })
// requestUpdateEvent.on('perform', params => {
  
// })
// requestUpdateEvent.on('reject', params => {
  
// })
// requestUpdateEvent.on('requireMoreInfo', params => {
  
// })

// export class RequestQueue {

//   private static event = requestUpdateEvent
  
//   static emit<U extends keyof IRequestUpdateEventHandler>(
//     event: U,
//     args: IRequestUpdateEventHandler[U]
//   ) {
//     this.event.emit(event, args)
//     // send email notify
//     // send message notify
//   }

//   static async queue(request: IDBRequestCore){
    
//   }

//   static async isCreator(userContext: UserModel, request: IDBRequestCore): Promise<IDBRequestCore|undefined>{
//     return request.createdBy == userContext.userID ? request : undefined
//   }

//   static async isAtPhase(userContext: UserModel, request: IDBRequestCore): Promise<boolean>{
//     // if BOD => allow perform at any phase


//   }

//   static async isAssociateToRequest(userContext: UserModel, request: IDBRequestCore){
//     const associatedRequests = await RequestModel.getRequests(userContext)
//     const foundAssociatedRequest = associatedRequests.find(dbreq => dbreq.requestID == request.requestID )
//     return foundAssociatedRequest
//   }
// }