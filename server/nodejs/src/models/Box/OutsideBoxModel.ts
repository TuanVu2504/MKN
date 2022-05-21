import { IBox, IDeployedBox, ICustomer, INetworkDevice } from '/project/shared'
import { MKNBase } from '@Backend/models'

export interface Box extends IBox {}
export class Box extends MKNBase<IBox> implements IBox {
  protected __constructor: IBox
  constructor(props: IBox){
    super(props)
    Object.assign(this, props)
  }

  /**
   * Ater deplyed, this box will no longer free box anymore
   *    - Wont be find by `Box.getBoxID`
   *    - Add to table `deployed_box`
   */
  deployTo(coord: number[]){

  }

  requestMantainance(reason: string){

  }

  /**
   * Return free box in stock by `boxID`
   */
  static getBoxID(boxID: string){
    
  }
}


export interface DeployedBox extends IDeployedBox {}
export class DeployedBox extends Box implements IDeployedBox {
  constructor(props: IDeployedBox){
    super(props)
    Object.assign(this, props)
  }

  /**
   * ```
   * Return this box to stock
   * Required: All connections to this box must be disconnected
   * ```
   */
  returnToStock(){

  }

  /**
   * Mouse this box to other location
   * Required: All connections to this box must be disconnected
   */
  moveLocation(coord: number[]){

  }
  /**
   * 
   * @param port - connect from port on this box
   * @param dest ```
   *    - Could be customer side
   *    - Could be other network device on specfic port
   * ```
   * Required: `port` must be free to connect
   */
  connectTo(port: number, dest: ICustomer | { device: INetworkDevice, port: number }){

  }

  static getBoxID(boxID: string){

  }
}