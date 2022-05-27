export type TAPIFn = (...args: any[]) => Promise<any>
export type TAPIReturn<APIFunction> = APIFunction extends (...args: any[]) => Promise<infer R> ? R : never
export type GetKeyMatch<T, M> = GetTypeMath<T, M>[keyof T]
export type GetTypeMath<T, M> = { [K in keyof T]-?: T[K] extends M ? K : never }
export type Entry<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type Keys<T> = (keyof T)[]

export type FixTsUnion<T, K extends keyof T> = {[Prop in keyof T]?: Prop extends K ? T[Prop]: never}
export type oneOf<T> = { [K in keyof T]: Pick<T, K> & FixTsUnion<T, K>}[keyof T];
export type Optional<T, K extends keyof T> = Partial<Pick<T, K>>