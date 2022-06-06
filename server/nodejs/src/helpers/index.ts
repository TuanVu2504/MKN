import { AuthorizedError } from '@Backend/Error'
import { Request, Response, NextFunction } from 'express'
import * as core from 'express-serve-static-core'
import config from '@Backend/config'
import { IResLocal } from '@Backend/Interface'


type TASHCallback<P=core.ParamsDictionary, TResBody=any, TIReqBody=any, TIReqQuery=any> = 
  (
    req: Request<P, TResBody,TIReqBody, TIReqQuery>,
    res: Response<TResBody>,
    next: NextFunction
  ) => any
/**
 * ````
 * - 0: Params /:something
 * - 1: ResBody any
 * - 2: IReqBody req.body
 * - 3: IReqQuery req.query
 * ````
 */
export const ash = <P=core.ParamsDictionary, TResBody=any, TIReqBody=any, TIReqQuery=any>
  (callback: (
    req: Request<P, TResBody,TIReqBody, TIReqQuery>,
    res: Response<TResBody>,
    next: NextFunction
  ) => Promise<any> ) => {
    return (req:Request<P, TResBody, TIReqBody, TIReqQuery>, res:Response<TResBody>, next:NextFunction) => {
      callback(req,res,next)
      .catch(next)
    }
}

export function sendReponse<T>(res: Response, res_object: T){
  res.json({
    error: null,
    data: res_object
  })
}
/**
 * Any
 *  pers: GET /categories
 *  pers: GET /categories/:categoryName
 *  pers: GET /categories/:categoryName/:itemID
 *  pers: POST /requests/hr/
 *          body: IReqChangeDepartment
 *          body: IReqResign
 *        POST /requests/stock/
 *          body: IReqGetStockItem
 *          body: IReqReturnStockItem
 * 
 * & position=Manager
 *  pers: POST /requests/hr
 *          body: IReqReturnStaffToHR
 *          body: IReqHireStaff
 *        POST /requests/purchase
 *          body: IReqBuyItem
 *          
 * HR
 *  pers: GET /users
 *  - manager:
 *    pers: PUT /users/:userID
 * 
 * Sale
 *  pers: POST /requests/boxDepoy
 *          body: IReqDeployBox
 *  pers: POST /contracts
 *  pers: POST /customers
 *  - manager:
 *    pers: GET /users
 *    pers: GET /constracts
 *    pers: GET /customers
 *    pers: PUT /constracts/:constractID [state]
 *    pers: PUT /customers/:customerID [contact]
 *  - staff
 *    pers: GET /customers associate with
 * 
 * Stock:
 *  pers: POST /categories
 *  pers: PUT /categories/:categoryID !totalCount
 *  pers: POST /categories/:categoryID - it should be add via scan code system operation
 *  pers: PUT /categories/:categoryID/:itemID !inStock
 *  - manager:
 *    pers: GET /users
 *    
 * CS
 *  pers: GET /requests/cs
 *  pers: POST /requests/cs
 *          body: IReqMoveLocation
 *          body: IReqOnsite    
 *          body: IReqComplain
 * 
 * SIR:
 */
// export function Authorized(resource: IResource){
//   return (method: IMethod) => {
//     return ash(async(req, res: Response<any, IResLocal>,next) => {
//       const { userContext } = res.locals
//       // ALL ON ALL
//       if(userContext.role.permissions.some(p => 
//         p.resource == "ALL" && p.method == "ALL")) return next()

//       // ALL ON SPECIFIC resource
//       if(userContext.role.permissions.some(p => 
//         p.resource == resource && p.method == "ALL")) return next()

//       if(userContext.role.permissions.some(p => 
//         p.resource == resource && p.method == method)) return next()
      
//       switch(resource){
//         case 'category': {
//           switch(method){
//             case 'GET': {
//               // every one can get category info
//               return next()
//             }
//           }
//         }
//         case 'user': {
//           switch(method){
//             case 'GET':{
//               // allow self
//               if(req.query.id == userContext.userID){ return next()}
//             }
//             case 'PUT': {
//               // allow to modify some proery only
//               // if ['allow-props-to-modify'].include(req.params.id) return next()
//             }
//           }
          
//         }
//         case 'contract': {}
//         case 'customer': {}
//         /**
//          * if resourceID - pageID exist in permission table =>
//          *  user must have this permission to access the page
//          * else
//          *  every one can access the page
//          */
//         case 'page': {}
//         default: throw new AuthorizedError(resource, method)
//       }
//     })
//   }
// } 


export function getTokenFromHeader(req: Request){
  const token = req.cookies[config.auth_token_name]
  return token
}

export * from './VerifyInput'