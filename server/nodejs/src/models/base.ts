export class MKNBase<T> {
  protected __constructor: T
  constructor(props: T){
    this.__constructor = props
  }
  get json(){ return this.__constructor }
}