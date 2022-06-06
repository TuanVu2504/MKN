import { EAccountType, TAccountType } from '/project/shared'
export interface IUserDTO {
  /** - Newly add, need to be add to database schema */
  employeeId: string,
  userId: string,
  userName: string,
  inDate: string,
  birthday: string,
  email?: string,
  department: IDepartmentDTO,
  account: IAccountDTO,
  position: IUserPositionDTO
}

export interface IDepartmentDTO {
  departId: string,
  departName: string,
  departCode: string,
  departState: IFlagDTO
}

export interface IAccountDTO {
  accountId: string,
  displayName: string,
  accountType: TAccountType,
}

export interface IUserPositionDTO { 
  posId: string,
  posName: string,
  posCode: string,
}

export interface IFlagDTO { 
  flagId: string,
  flagDescription: string
}


export interface ITicketDTO {
  ticketId: string,
  requester: IAccountDTO,
  ticketType: ITicketTypeDTO,
  queueHolder: IDepartmentDTO,
  ticketState: IFlagDTO,
  ticketActivities: ITicketActivityDTO[],
  assignee: IAccountDTO,
  locations?: ICoordinateDTO[],
  itemList?:IItemListDTO[]
}

export interface ITicketTypeDTO {
  ticketType: string,
  ticketTypeName: string,
  ticketTypeHolder: IDepartmentDTO,
}

export interface ITicketActivityDTO {
  ticketActivityId: string,
  actionBy: IAccountDTO,
  updatedAt: string,
  sequence: number,
  actionPerformed: IFlagDTO,
  comment?: string
}

export interface ICoordinateDTO {
  coordId: string,
  latt: string,
  long: string
}

export interface IItemListDTO {
  itemListId: string,
  createdAt: string,
  items: IItemDTO[]
}

export interface IItemDTO {
  itemId: string,
  category: ICategoryDTO,
  state: IFlagDTO,
  stock?: IStockDTO,
  user?: IUserDTO,
  itemList?: IItemListDTO
}

export interface ICategoryDTO {
  categoryId: string,
  categoryName: string,
  description?: string,
  brand: string,
}

export interface IStockDTO {
  stockId: string,
  stockName: string
}

export interface IImageDTO {
  imageId: string
}
