// import { NextFunction, Router, Response } from 'express'
// import { TRequestActionPayload, ERequestActivity } from '/project/shared'
// import { 
//   RequestPhaseError, RequestAuthorizeError 
// } from '@Backend/Error'
// import { IResLocal } from '@Backend/Interface'
// import { requestController } from '@Backend/controller'
// import { RequestModel,ViewModel, RequestQueue } from '@Backend/models'
// import { ash, sendReponse } from '@Backend/helpers'

// const router = Router()

// router.route('/')
//   .get(ash(requestController.getRequests))
//   .post(ash(requestController.postRequest))
  
// router.route('/:requestID')
//   .put(ash<{ requestID: string },{}, TRequestActionPayload>(async(
//     req,
//     res: Response<any, IResLocal>,
//     next:NextFunction) => {
//       const { userContext } = res.locals
//       const { requestID } = req.params
//       const { action, comment } = req.body

//       RequestModel.requireParams({ requestID })
//       RequestModel.requireParams({ action })
//       const request = await RequestModel.findRequestOrError(requestID, { state: 'open' })

//       if(action == 'close'){
//         const creatorOfRequest = await RequestQueue.isCreator(userContext, request)
//         if(!creatorOfRequest) 
//           throw new RequestAuthorizeError(request.requestID, 'close')
//           await userContext.closeRequest(request)
      
//       } else {
//         const isAtPhase = RequestQueue.isAtPhase(userContext, request)
//         if(!isAtPhase)
//           throw new RequestPhaseError(action)
        
//         if(action == 'reject'){
//           userContext.rejectRequest(request)
//         }

//         if(action == 'requireMoreInfo'){
//           require(comment)
//           userContext.requestUpdateRequest(request, comment)
//         }

//         if(action == 'perform'){
//           userContext.performRequest(request)
//         }
//       }

//       RequestQueue.emit(action, { userContext: this, request, comment })
//       ViewModel.getRequestById(requestID)
//         .then(request => sendReponse(res, request))
//   }))

// export default router