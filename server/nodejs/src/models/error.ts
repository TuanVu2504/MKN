import { TAPIError, TErrorDetail } from '/project/shared'

export class AuthError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail }

  constructor(reason: string){
    const error = { status:401, name: 'Authenticaion', message: reason, details: {}}
    this.error = error
  }
}


export class ResourceError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail; }
  /**
   * 
   * @param reason 
   * @param status - default `404`
   */
  constructor(reason: string, status: number = 404){
    const error = { status, name: 'Resources', message: reason, details: {} }
    this.error = error
  }
}