import { TAPIError, TAPIFn, TAPIReturn } from '/project/shared'



export function consumeAPI<Fn extends TAPIFn>
  (
    apicall: Fn,
    onSuccess:(data: TAPIReturn<Fn> ) => void,
    onError?: (err: TAPIError) => void
  ) {
    apicall()
    .then(onSuccess)
    .catch(err => {
      if(onError){
        return onError(err)
      }
      //it should trigger a toast error panel
      console.log(err)
    })
  }