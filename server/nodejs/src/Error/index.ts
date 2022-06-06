// import { TicketBase } from '@Backend/models';
import { IResource, IMethod, TAPIError, 
  TErrorDetail,
  // TRequestActionPayload 
} from '/project/shared'

export class AuthError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail }

  constructor(reason: string){
    const error = { status:401, name: 'Authenticaion', message: reason, details: {}}
    this.error = error
  }
}

export class GenericError implements TAPIError {
  data = null;
  error: { status: number; name: string; message: string; details: TErrorDetail; };
  constructor(error: string, code?: number){
    this.error = { status: code || 400, name:'Generic', message: error, details: {} }
  }
}


export class ResourceNotFoundError implements TAPIError {
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

export class AuthorizedError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail; }
  constructor(content: IResource, method: IMethod){
    this.error = {
      status: 403,
      message: `You are not allowd to ${method} on ${content}`,
      details: {},
      name: 'Unauthorized'
    }
  }
}

export class TicketAuthorizeError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail; };
  constructor(ticketId: string, action: string){
    this.error = {
      status: 403,
      name: 'Unauthorized',
      message: `You are not allowed to ${action} on ticket ${ticketId}`,
      details: {}
    }
  }
}

export class ItemOwnerError implements TAPIError {
  data = null;
  error: { status: number; name: string; message: string; details: TErrorDetail; };
  constructor(itemId: string){
    this.error = {
      status: 403,
      name: 'UnAuthorizedOwner',
      message: `You are not the owner of item ${itemId}`,
      details: {}
    }
  }
}

// export class RequestAuthorizeError implements TAPIError {
//   data = null
//   error: { status: number; name: string; message: string; details: TErrorDetail; };
//   constructor(requestID: string, action: TRequestActionPayload['action'] ){
//     this.error = {
//       status: 403,
//       name: 'Unauthorized',
//       message: `You are not allowed to ${action} on this request ${requestID}`,
//       details: {}
//     }
//   }
// }

export class ParamRequiredError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail; };
  constructor(params: string, message?: string){
    this.error = {
      status: 400,
      name: 'RequiredParams',
      message: `Params ${params} is required`,
      details: {}
    }
    if(message) this.error.message += ` ,${message}`
  }
}
export class MKNTypError {
  static ExpectedStringOrNumber(){
    return {
      data: null,
      error: {
        status: 400,
        name: 'TypeError',
        message: `Expect string or number`,
        details: {}
      }
    }
  }
}


export class MKNError implements TAPIError {
  data = null
  error: { status: number; name: string; message: string; details: TErrorDetail; };
  constructor(message: string, name?:string, status?:number){
    this.error = {
      message,
      name: name || "MKNError",
      status: status || 400,
      details: {}
    }
  }
}

// export class RequestHandlerNotFoundError implements TAPIError {
//   data: null;
//   error: { status: number; name: string; message: string; details: TErrorDetail; };
//   constructor(request: Omit<IDBRequestCore, "requestID">){
//     this.error = {
//       status: 404, 
//       name: 'RequestHandlerNotFound', 
//       message: `There is no handler for service: ${request.service} type: ${request.ticketType}`,
//       details: {}
//     }
//   }
// }

// export class TicketClosedError implements TAPIError {
//   data: null;
//   error: { status: number; name: string; message: string; details: TErrorDetail; };
//   constructor(ticket: TicketBase){
//     this.error = {
//       status: 400,
//       name: 'TicketClosedError',
//       message: `The ticket ${ticket.ticketId} is closed. Unable to update or do anything`,
//       details: {},
//     }
//   }
// }

// export class CreateRequestError implements TAPIError {
//   data: null;
//   error: { status: number; name: string; message: string; details: TErrorDetail; };
//   constructor(request: TMKNRequest){
//     this.error = {
//       status: 403, 
//       name: 'RequestAuthorized', 
//       message: `You are not authorized to create request ${request.service} type: ${request.ticketType}`,
//       details: {}
//     }
//   }
// }

// export class RequestPhaseError implements TAPIError {
//   data: null;
//   error: { status: number; name: string; message: string; details: TErrorDetail; };
//   constructor(action: TRequestActionPayload['action']){
//     this.error = {
//       status: 403, 
//       name: 'RequestPhaseError', 
//       message: `You are not allowd to ${action} on this request at this phase`,
//       details: {}
//     }
//   }
// }

