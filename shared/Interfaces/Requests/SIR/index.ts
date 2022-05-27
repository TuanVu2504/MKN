
import { IMKNRequest, IViewCoordinate } from '/project/shared'

export interface ISurveyLocationRequest extends IMKNRequest, IViewCoordinate {
  ticketType: 'surveyLocation',
}

export interface IDeployBoxRequest extends IMKNRequest, IViewCoordinate {
  ticketType: 'deployBox',
}