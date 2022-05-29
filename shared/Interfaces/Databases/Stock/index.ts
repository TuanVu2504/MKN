import { TDBFlags } from '/project/shared'

export interface IDBStock {
  stockId: string
  stockName: string
}

export interface IDBItems extends 
  Pick<IDBCategories, "categoryId">
{
  itemId: string,
  state: TDBFlags,
  holderType: 'stock' | 'user' | 'ticket',
  holderId: string
  referenceId: string,
}

export interface IDBCategories {
  categoryId: string,
  categoryName: string,
  description?: string,
  brand: string
}

export interface IDBStockItem extends
  Pick<IDBStock, "stockId">,
  Pick<IDBItems, "itemId"> {}

export interface IDBTicketItemList extends
  Pick<IDBCategories, 'categoryId'>,
  Pick<IDBStock, 'stockId'>,
  Partial<Pick<IDBItems, 'itemId'>>,
  Pick<IDBItemList, 'itemListId'>
{}

export interface IDBItemList {
  itemListId: string,
  createdAt: string
}




// export interface IDBDevicePort { 
//   deviceID: string,
//   portIndex: string,
//   description: string,
//   to: string,
//   portType: TPortType
// }

// export interface IDBNetworkDevice extends
//   Pick<IDBDeviceItem, "deviceId"> {
//   ipMgmt: string,
// }

// export interface IDBDeviceCategory {
//   /**@description `uuidv4` */
//   categoryId: string,
//   name: string,
//   description?:string,
//   brand: string,
// }

// export interface IDBDeviceItem extends 
//   Pick<IDBDeviceCategory, "categoryId"> 
// {
//   /**@description `uuidv4` */
//   deviceId: string,
//   snOrImei: string,
// }

// export interface IStockDevice {
//   deviceId: string,
// }
