


type TAPIFn = (...args: any[]) => Promise<any>
type TAPIReturn<APIFunction> = APIFunction extends (...args: any[]) => Promise<infer R> ? R : never
type TAPIError = {
  data: null, 
  error: {
    status: number,
    name: string,
    message: string,
    details: {}
  }
}

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
        onError(err)
      }
      //it should trigger a toast error panel
      console.log(err)
    })


  }