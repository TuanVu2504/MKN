import { TAPIError } from '/project/shared'

export class Fetch {
  static baseUrl = "https://file.mekongnet.com.kh/strapiserver"
  static authorization_token: string | undefined;
  static doFetch<T>(url: RequestInfo, init?: RequestInit){
    const _init = Object.assign(init || {}, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

    if(Fetch.authorization_token != undefined){
      _init.headers = Object.assign(_init.headers, {
        Authorization: `Bearer ${Fetch.authorization_token}`
      })
    }
    return fetch(url, _init)
    .then( async res => {
      try {
        const resStatus = res.ok
        const res_obj = await res.json()
        if(!resStatus) 
          throw res_obj
        
        return res_obj as T
      } catch(err:any) {
        if("error" in err){ throw err }
        throw {
          data: null, error: { status: 100, message: "Can\'t parse response object", name: "API RESPONSE ERROR" }
        } as TAPIError
      }
    })
  }
}