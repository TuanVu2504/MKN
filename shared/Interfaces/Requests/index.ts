import { IDeployBoxRequest, ISurveyLocationRequest } from './SIR'
import { IReqHireStaff, IReqReturnStaffToHR } from './HR'

export * from './Request'
export * from './SIR'
export * from './HR'
export type TMKNRequest = IDeployBoxRequest | ISurveyLocationRequest
                        // | IReqHireStaff | IReqReturnStaffToHR