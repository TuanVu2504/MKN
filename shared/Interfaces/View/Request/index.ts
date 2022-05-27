import { ISurveyLocationRequest, IDeployBoxRequest, ICreatable } from '/project/shared'

export interface IViewDeployBoxRequest extends IDeployBoxRequest, ICreatable {}
export interface IViewSurveyLocationRequest extends ISurveyLocationRequest, ICreatable {}