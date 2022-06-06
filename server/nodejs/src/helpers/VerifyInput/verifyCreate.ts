import { ParamRequiredError, MKNError } from '@Backend/Error'
import { StringVerify } from '/project/shared'

export function ParamsRequired(object: Object){

  const keyMissing = Object.entries(object)
                          .reduce((prev: string[], [k,v]) => { 
                            if(v == undefined || v == null || v == ''){
                              return [...prev, k]
                            }
                            return prev
                          }, [])
  if(keyMissing.length > 0) 
    throw new ParamRequiredError(keyMissing.join(', '))
}

export function IsDateUnix(date: string|number){
  if(typeof date != "string" && typeof date != "number"){
    throw new MKNError("Expected string or number")
  }
  if(!StringVerify.UnixDateString.test(date)){
    console.log(date)
    throw new MKNError("Expect unix date string")
  }
}