export type TAPIFn = (...args: any[]) => Promise<any>
export type TAPIReturn<APIFunction> = APIFunction extends (...args: any[]) => Promise<infer R> ? R : never
export type GetKeyMatch<T, M> = GetTypeMath<T, M>[keyof T]
export type GetTypeMath<T, M> = { [K in keyof T]-?: T[K] extends M ? K : never }