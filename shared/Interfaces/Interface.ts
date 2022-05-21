import { ISurveyBoxRequest } from '.'

// GENERIC
export type TAPIError = {
  data: null, 
  error: {
    status: number,
    name: string,
    message: string,
    details: TErrorDetail
  }
}

export type TErrorDetail = {}
  | { errors: { path: string[], name: string, message: string }[] }

interface IPassword {

}


// CUSTOMER
export interface ICustomer {

}

// USER
export interface IUser {
  username: string,
  email: string,
  provider: string,
  password: IPassword,
  resetPasswordToken: string,
  confirmationToken: string,
  confirmed: boolean,
  blocked: boolean,
  role: IUserPermission
}

interface IUserPermission {
}

// DEVICES
export interface IDevice {
  /**@description `uuidv4` */
  device_id: string,
  snOrImei: string,
  brand: string,
  name: string
}
export interface INetworkDevice extends IDevice {
  ports: IPort[]
}
//// DEVICE ELEMENTS
export type TPortType = "rj45" | "rs232" | "optic"

export interface IPort {
  port_index: number,
  description: string,
  to: object
  port_type: TPortType
}

//// BOX
export interface IBox extends INetworkDevice, IStock {
  
}


// MAP
export interface IMapProps {
  children?: any,
}

export interface IThingsCoordinate {
  /**
   * - index 0 - latt
   * - index 1 - long
   */
  coordinate: number[]
}

// DATABSE
export interface IStock {
  totalCount: number,
  inStock: number,
}



// END


