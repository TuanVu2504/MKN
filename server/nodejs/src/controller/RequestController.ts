// import { Router, Request, Response, NextFunction } from 'express'
// import * as core from 'express-serve-static-core'
// import { CoordinateModel, RequestCoordModel, RequestModel, 
//   RequestQueue, UserModel, ViewModel 
// } from '@Backend/models'
// import { RequestHandlerNotFoundError, ViewRequestAuthorizeError } from '@Backend/Error'
// import { IResLocal } from '@Backend/Interface'
// import { sendReponse } from '@Backend/helpers'
// import { IDBRequestCore, TMKNRequest, EState } from '/project/shared'

// export const postRequest = async (
//   req: core.Request<{},{}, Omit<TMKNRequest, "requestID">>,
//   res: Response<any, IResLocal>,
//   next: NextFunction
// ) => {
//   const { body } = req

//   const createRequest: Omit<IDBRequestCore, "requestID"|'endAt'> = {
//     state: ERequestState.open,
//     createdAt: new Date().getTime().toString(),
//     service: req.body.service,
//     type: req.body.type,
//     parent: req.body.parent ? req.body.parent.requestID : undefined,
//     createdBy: res.locals.userContext.userID, 
//     deadlineAt: req.body.deadlineAt,
//   }

//   const createdRequest = await RequestModel.addRequest(createRequest)
//   await res.locals.userContext.createRequest(createdRequest)

//   switch(body.service){
//     case 'sir': {
//       switch(body.type){
//         case 'surveyLocation':
//         case 'deployBox': {
//           // new = add database
//           const { coordinate } = body
//           const dbCoordinate = await CoordinateModel.addCoord({ latt:coordinate[0], long: coordinate[1] })
//           RequestCoordModel.add(createdRequest, dbCoordinate)
//           // queue
//           RequestQueue.queue(createdRequest)

//           // res.json(new)
//           break;
//         }
//       }
//     }

//     case 'stock':{
//       switch(body.type){
//       }
//     }

//     default: throw new RequestHandlerNotFoundError(createdRequest)
//   }
// }

// const getRequests = async (
//   req: Request,
//   res: Response<any, IResLocal>, 
//   next: NextFunction
// ) => {
//   const { userContext } = res.locals
//   const associatedRequests = await RequestModel.getRequests(userContext)
  
//   if(associatedRequests.length == 0) 
//     return sendReponse(res, [])
 
//   const viewRequests = await ViewModel.getRequests(associatedRequests)
//     return sendReponse(res, viewRequests)
// }

// const getRequestByID = async (
//   req: core.Request<{ requestID: string }>,
//   res: Response<any, IResLocal>,
//   next: NextFunction
// ) => {
//   const { userContext } = res.locals
//   const { requestID } = req.params
//   RequestModel.requireParams({ requestID })
//   const request = await RequestModel.findRequestOrError(requestID)
//   const foundAssociatedRequest = await RequestQueue.isAssociateToRequest(userContext, request)
//   if(!foundAssociatedRequest) throw new ViewRequestAuthorizeError(requestID)

//   const viewRequest = await ViewModel.getRequestById(requestID)
//   sendReponse(res, viewRequest)
// }

// export const requestController = {
//   postRequest,
//   getRequests,
//   getRequestByID
// }