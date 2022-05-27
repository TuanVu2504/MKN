export class MKNBase<T> {
  protected __constructor: T
  constructor(props: T){
    this.__constructor = props
  }
  toJSON(){ return this.__constructor }
}