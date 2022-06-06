import { IDepartmentDTO, IUserPositionDTO } from './database'
import { IItemDTO } from '/project/shared'

export interface IItemCreateDTO {
  categoryId: string,
  serialOrImei?: string,
}

export interface ICategoryCreateDTO {
  categoryName: string,
  description?:string,
  brand: string,
}

export interface ICreateDepartmentDTO {
  departName: string,
  departCode: string,
}

export interface ICreateUserDTO {
  employeeId: string,
  userName: string,
  departId: IDepartmentDTO,
  posId: IUserPositionDTO,
  inDate: number,
  birthday: number
}

export interface ICreatePositionDTO {
  posName: string,
  posCode: string
}