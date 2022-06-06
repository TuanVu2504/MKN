import { DataSource } from 'typeorm'
import config from './config'
import { Category, Item, Account, Stock,
  Flags, Department, Ticket, User, UserPosition,
  TicketActivity, TicketType, Coordinate, 
  ItemList, Image
} from './entity'
export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.dbhost,
  port: config.dbport,
  username: config.dbuser,
  password: config.dbpassword,
  database: config.dbdatabase,
  synchronize: true,
  // logging: true,
  entities: [
    Category, Item, Account, User, UserPosition,
    Flags, Department, Ticket,
    TicketActivity, TicketType, Coordinate,
    Stock, ItemList,Image
  ],
  subscribers: [],
  migrations: ["./migration/*.js"],
  extra: {
    "connectionLimit": 20
  }
})

export const DepartmentRepository = AppDataSource.getRepository(Department)
export const AccountRepository = AppDataSource.getRepository(Account)
export const UserRepository = AppDataSource.getRepository(User)
export const UserPositionRepository = AppDataSource.getRepository(UserPosition)
export const FlagsRepository = AppDataSource.getRepository(Flags)

