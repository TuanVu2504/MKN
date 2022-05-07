

export class Fetch {
  static baseUrl = "https://file.mekongnet.com.kh/strapiserver"
  static authorization_token: string | undefined;
  static fetch<T>(url: RequestInfo, init?: RequestInit){
    const _init = Object.assign(init || {}, {
      credentials: "include",
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
        const res_obj = await res.json()
        if(!res.ok){
          throw res_obj
        }
        return res_obj as T
      } catch {
        throw new Error(`can parse object`)
      }
    })
  }
}