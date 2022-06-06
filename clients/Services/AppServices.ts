import { ICreateDepartmentDTO, ICreatePositionDTO, ICreateUserDTO, IDepartmentDTO, IUserDTO, IUserPositionDTO } from '/project/shared'
import { Fetch } from './fetch'

class DepartmentService { 
  static getAll(){
    return Fetch.doFetch<IDepartmentDTO[]>(Fetch.baseUrl + "/api/departments")
  }

  static put(departId: string){
    return async (body: Partial<IDepartmentDTO>) => {
      return Fetch.doFetch<IDepartmentDTO>(Fetch.baseUrl + "/api/departments/" + departId, {
        method: "PUT",
        body: JSON.stringify(body)
      })
    }
  }

  static delete(department: IDepartmentDTO){
    return Fetch.doFetch(Fetch.baseUrl + "/api/departments/" + department.departId, {
      method: "DELETE",
    })
  }

  static async post(body: ICreateDepartmentDTO) {
    return Fetch.doFetch<IDepartmentDTO>(Fetch.baseUrl + "/api/departments", {
      method: "POST",
      body: JSON.stringify(body)
    })
  }
}



export class PositionService {
  static getAll(){
    return Fetch.doFetch<IUserPositionDTO[]>(Fetch.baseUrl + "/api/positions")
  }

  static put(posId: string){
    return async (body: Partial<IUserPositionDTO>) => {
      return Fetch.doFetch<IUserPositionDTO>(Fetch.baseUrl + "/api/positions/" + posId, {
        method: "PUT",
        body: JSON.stringify(body)
      })
    }
  }

  static delete(position: IUserPositionDTO){
    return Fetch.doFetch(Fetch.baseUrl + "/api/positions/" + position.posId, {
      method: "DELETE",
    })
  }

  static async post(body: ICreatePositionDTO) {
    return Fetch.doFetch<IUserPositionDTO>(Fetch.baseUrl + "/api/positions", {
      method: "POST",
      body: JSON.stringify(body)
    })
  }
}

export class UserService {
  static getAll(){
    return Fetch.doFetch<IUserDTO[]>(Fetch.baseUrl + "/api/users")
  }

  static async post(user: ICreateUserDTO){
    return Fetch.doFetch<IUserDTO>(Fetch.baseUrl + "/api/users", {
      method: "POST",
      body: JSON.stringify(user)
    })
  }


  static delete(user: IUserDTO){
    return Fetch.doFetch(Fetch.baseUrl + "/api/users/" + user.userId, {
      method: "DELETE",
    })
  }
}

export const AppService = {
  DepartmentService,
  PositionService,
  UserService,
}