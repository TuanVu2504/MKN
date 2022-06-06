import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, PrimaryColumn, Relation, JoinColumn, OneToOne, ManyToMany, JoinTable, BaseEntity, } from 'typeorm'
import { ETable, EAccountType, TAccountType, THolderType } from '/project/shared'
@Entity({ name: ETable.stock })
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  stockId: string

  @Column({ nullable: false })
  stockName: string

  @OneToOne(() => Coordinate, coord => coord.stock, { nullable: false })
  @JoinColumn({ name: 'coordId' })
  coord: Relation<Coordinate>

  @OneToMany(() => Item, item => item.stock)
  items: Relation<Item[]>
}


@Entity({ name: ETable.flags })
export class Flags extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  flagId: string

  @Column({ nullable: false }) 
  flagDescription: string

  @OneToMany(() => Department, department => department.departState)
  departments: Relation<Department[]>

  @OneToMany(() => TicketActivity, ticketActivity => ticketActivity.actionPerformed)
  ticketActions: Relation<TicketActivity[]>

  @OneToMany(() => Account, account => account.accountState)
  accounts: Relation<Account[]>

  @OneToMany(() => Item, item => item.state)
  items: Relation<Item[]>

  @OneToMany(() => Ticket, ticket => ticket.ticketState)
  ticket: Relation<Ticket[]>
}

@Entity({ name: ETable.categories })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string

  @Column({ nullable: false }) 
  categoryName: string

  @Column({ nullable: true }) 
  description: string

  @Column({ nullable: false }) 
  brand: string

  @OneToMany(() => Item, item => item.category)
  items: Relation<Item[]>
}

@Entity({ name: ETable.items })
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @ManyToOne(() => Category, category => category.items, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>

  @Column()
  serialOrImei: string

  @ManyToOne(() => Flags, { nullable: false })
  @JoinColumn({ name: 'state' })
  state: Relation<Flags>

  @ManyToMany(() => ItemList,itemList => itemList.items)
  itemList: Relation<ItemList[]>

  @ManyToOne(() => Stock, stock => stock.items)
  @JoinColumn({ name: 'stockId' })
  stock: Relation<Stock>

  @ManyToOne(() => User, user => user.items)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>
}

@Entity({ name: ETable.accounts })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: string

  @Column({ nullable: false }) 
  displayName: string

  @ManyToOne(() => Flags,{ nullable: false })
  @JoinColumn()
  accountState: Relation<Flags>

  @Column({
    nullable: false,
    type: "enum",
    enum: EAccountType
  }) 
  accountType: TAccountType

  @OneToMany(() => Ticket, ticket => ticket.requester)
  createdTickets: Relation<Ticket[]>

  @OneToMany(() => Ticket, ticket => ticket.assignee)
  ticketAssigned: Relation<Ticket[]>

  @OneToMany(() => TicketActivity, ticketActivity => ticketActivity.actionBy)
  ticketActivities: Relation<TicketActivity[]>

  @OneToOne(() => User, user => user.account)
  user: Relation<User>

  @OneToOne(() => Image,{ nullable: true })
  @JoinColumn({ name: 'imageId' })
  avatar: Relation<Image>
}

@Entity({ name: ETable.departments })
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  departId: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  departName: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  departCode: string

  @ManyToOne(() => Flags, { nullable: false, eager: true })
  @JoinColumn({ name: 'departState' })
  departState: Relation<Flags>

}

@Entity({ name: ETable.users })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string

  @Column({ nullable: false })
  userName: string

  @Column({ nullable: false })
  employeeId: string

  @Column({ nullable: false, type: 'bigint' })
  birthday: string

  @Column({ nullable: false, type: 'bigint' })
  inDate: string

  @Column({ nullable: true })
  email: string

  @ManyToOne(() => Department, { nullable: false, eager: true })
  @JoinColumn({ name: 'departId' })
  department: Relation<Department>

  @OneToOne(() => Account, { nullable: false, eager: true })
  @JoinColumn({ name: 'accountId' })
  account: Relation<Account>

  @ManyToOne(() => UserPosition, { nullable: false, eager: true })
  @JoinColumn({ name: 'posId' })
  position: Relation<UserPosition>

  @OneToMany(() => Item, item => item.user)
  items: Relation<Item[]>

  @OneToMany(() => Image, image => image.user, { eager: true })
  images: Relation<Image[]>
}

@Entity({ name: ETable.images })
export class Image extends BaseEntity { 
  @PrimaryGeneratedColumn('uuid')
  imageId: string

  @Column({ nullable: false, select: false })
  thumbnail: string

  @Column({ nullable: false, select: false })
  small: string

  @Column({ nullable: false, select: false })
  medium: string

  @Column({ nullable: false, select: false })
  large: string

  @Column({ nullable: false, select: false })
  orginal: string

  @ManyToOne(() => User, user => user.images, { nullable: false } )
  @JoinColumn({ name: 'userId' })
  user: Relation<User>
}

@Entity({ name: ETable.ticketTypes })
export class TicketType {
  @PrimaryColumn({ type: 'char', length: 36 })
  ticketType: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  ticketTypeName: string

  @ManyToOne(() => Department, { nullable: false })
  @JoinColumn({ name: 'ticketTypeHolder' })
  ticketTypeHolder: Relation<Department>

  @OneToMany(() => Ticket, ticket => ticket.ticketType)
  tickets: Relation<Ticket[]>
}

@Entity({ name: ETable.tickets })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  ticketId: string

  @ManyToOne(() => Account, account => account.createdTickets, { nullable: false })
  @JoinColumn({ name: 'requester' })
  requester: Relation<Account>

  @ManyToOne(() => TicketType, ticketType => ticketType.tickets, { nullable: false })
  @JoinColumn({ name: 'ticketType' })
  ticketType: Relation<TicketType>

  @ManyToOne(() => Department, { nullable: false })
  @JoinColumn({ name: 'queueHolder' })
  queueHolder: Relation<Department>

  @ManyToOne(() => Flags, { nullable: false })
  @JoinColumn({ name: 'ticketState' })
  ticketState: Relation<Flags>

  @OneToMany(() => TicketActivity, ticketActivity => ticketActivity.ticket)
  ticketActivities: Relation<TicketActivity[]>

  @ManyToOne(() => Account, account => account.ticketAssigned, { nullable: false })
  @JoinColumn({ name: 'assignee' })
  assignee: Relation<Account>

  @ManyToMany(() => Coordinate, coord => coord.tickets )
  @JoinTable({ 
    name: 'ticketLocation',
    joinColumn: { 
      name: 'ticketId', referencedColumnName: 'ticketId'
    }, 
    inverseJoinColumn: {
      name: 'coordId', referencedColumnName: 'coordId'
    }
   })
  locations: Relation<Coordinate[]>

  @ManyToMany(() => ItemList, itemList => itemList.tickets)
  @JoinTable({
    name: 'ticketItemList',
    joinColumn: { name: 'ticketId', referencedColumnName: 'ticketId' },
    inverseJoinColumn: { name: 'itemListId', referencedColumnName: 'itemListId' }
  })
  itemList: Relation<ItemList[]>
}

@Entity({ name: ETable.positions })
export class UserPosition extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  posId: string

  @Column({ nullable: false, type: 'char', length: 36 })
  posName: string

  @Column({ nullable: false, type: 'char', length: 36 })
  posCode: string

  @OneToMany(() => User, user => user.position)
  users: Relation<User[]>
}

@Entity({ name: ETable.ticketActivities })
export class TicketActivity {
  @PrimaryGeneratedColumn('increment')
  ticketActivityId: string

  @ManyToOne(() => Ticket, ticket => ticket.ticketActivities, { nullable: false })
  @JoinColumn({ name: 'ticketId' })
  ticket: Relation<Ticket>

  @ManyToOne(() => Account, account => account.ticketAssigned, { nullable: false })
  @JoinColumn({ name: 'actionBy' })
  actionBy: Relation<Account>

  @Column({
    type: 'bigint',
    nullable: false
  }) updatedAt: number

  @Column({
    nullable: false,
    type: 'tinyint'
  }) sequence: number

  @ManyToOne(() => Flags, { nullable: false })
  @JoinColumn({ name: 'actionPerformed' })
  actionPerformed: Relation<Flags>

  @Column({ nullable: true, type: 'varchar', length: 255 })
  comment: string
}

@Entity({ name: ETable.coordinates })
export class Coordinate {
  @PrimaryGeneratedColumn('uuid')
  coordId: string

  @Column({ nullable: false, type:'char', length: 20 })
  latt: string

  @Column({ nullable: false, type:'char', length: 20 })
  long: string

  @ManyToMany(() => Ticket, ticket => ticket.locations)
  tickets: Relation<Ticket[]>

  @OneToOne(() => Stock, stock => stock.coord)
  stock: Relation<Stock>
}

@Entity({ name: ETable.itemList })
export class ItemList {
  @PrimaryGeneratedColumn('uuid')
  itemListId: string

  @Column({ type: 'bigint', nullable: false })
  createdAt: string

  @ManyToMany(() => Item, item => item.itemList)
  @JoinTable({
    name: 'itemListItems',
    joinColumn: { name: 'itemListId', referencedColumnName: 'itemListId' },
    inverseJoinColumn: { name: 'itemId', referencedColumnName: 'itemId' }
  })
  items: Relation<Item[]>

  @ManyToMany(() => Ticket, ticket => ticket.itemList )
  tickets: Relation<Ticket[]>
}