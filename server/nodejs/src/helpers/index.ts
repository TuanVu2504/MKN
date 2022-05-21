import { Request, Response, NextFunction } from 'express'
import * as core from 'express-serve-static-core'
import { settings } from '/project/shared'


type TASHCallback<P=core.ParamsDictionary, TResBody=any, TReqBody=any, TReqQuery=any> = 
  (
    req: Request<P, TResBody,TReqBody, TReqQuery>,
    res: Response<TResBody>,
    next: NextFunction
  ) => any
/**
 * ````
 * - 0: Params /:something
 * - 1: ResBody any
 * - 2: ReqBody req.body
 * - 3: ReqQuery req.query
 * ````
 */
export const ash = <P=core.ParamsDictionary, TResBody=any, TReqBody=any, TReqQuery=any>
  (callback: (
    req: Request<P, TResBody,TReqBody, TReqQuery>,
    res: Response<TResBody>,
    next: NextFunction
  ) => Promise<any> ) => {
    return (req:Request<P, TResBody, TReqBody, TReqQuery>, res:Response<TResBody>, next:NextFunction) => {
      callback(req,res,next)
      .catch(next)
      // try {
      //   callback(req, res, next)
      // } catch(err){
      //   next(err)
      // }
    }
}

export function getTokenFromHeader(req: Request){
  const token = req.cookies[settings.auth_token_name]
  return token
}