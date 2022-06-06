import { TAPIError } from '/project/shared'

export class Fetch {
  /**
   * - "https://file.mekongnet.com.kh"
   */
  static baseUrl = "https://file.mekongnet.com.kh"
  static doFetch<T>(url: RequestInfo, init?: RequestInit){
    const _init = Object.assign(init || {}, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

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