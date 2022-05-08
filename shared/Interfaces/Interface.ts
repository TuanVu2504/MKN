export type TAPIError = {
  data: null, 
  error: {
    status: number,
    name: string,
    message: string,
    details: TErrorDetail
  }
}

type TErrorDetail = {}
  | { errors: { path: string[], name: string, message: string }[] }


export type TAPIFn = (...args: any[]) => Promise<any>
export type TAPIReturn<APIFunction> = APIFunction extends (...args: any[]) => Promise<infer R> ? R : never