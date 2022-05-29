import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, PrimaryColumn, Relation, JoinColumn, } from 'typeorm'

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string

  @Column({ nullable: false }) 
  categoryName: string

  @Column({ nullable: true }) 
  description: string

  @Column({ nullable: false }) 
  brand: string

  @OneToMany(() => Item, item => item.category)
  items: Item[]
}

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @ManyToOne(() => Category, category => category.items, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category

  @Column({
    nullable: false,
    enum: ['stock', 'user', 'ticket']
  }) 
  holderType: string

  @Column({ nullable: false }) 
  holderId: string

  @Column({ nullable: false })
  @ManyToOne(() => Flags, flag => flag.items)
  @JoinColumn({ name: 'state' })
  state: Flags
}

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  accountId: string

  @Column({ nullable: false }) 
  displayName: string

  @ManyToOne(() => Flags, flag => flag.accounts, { nullable: false})
  @JoinColumn({ name: 'accountState' })
  accountState: Flags

  @Column({
    nullable: false,
    enum: ['system', 'user']
  }) 
  accountType: 'system' | 'user'

  @OneToMany(() => Ticket, ticket => ticket.requester)
  createdTickets: Relation<Ticket[]>

  @OneToMany(() => Ticket, ticket => ticket.assignee)
  ticketAssigned: Relation<Ticket[]>

  @OneToMany(() => TicketActivity, ticketActivity => ticketActivity.actionBy)
  ticketActivities: Relation<TicketActivity[]>
}

@Entity({ name: 'flags' })
export class Flags {
  @PrimaryColumn()
  flagsId: string

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
}

@Entity({ name: 'departments' })
export class Department {
  @PrimaryGeneratedColumn('uuid')
  departId: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  departName: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  departCode: string

  @ManyToOne(() => Flags, flag => flag.departments, { nullable: false })
  @JoinColumn({ name: 'departState' })
  departState: Relation<Flags>

  @OneToMany(() => TicketType, ticketType => ticketType.ticketType)
  ticketTypes: Relation<TicketType[]>
}

@Entity({ name: 'ticketTypes' })
export class TicketType {
  @PrimaryColumn({ type: 'char', length: 36 })
  ticketType: string

  @Column({ nullable: false, type: 'varchar', length: 255 })
  ticketTypeName: string

  @ManyToOne(() => Department, department => department.ticketTypes, { nullable: false })
  @JoinColumn({ name: 'ticketTypeHolder' })
  ticketTypeHolder: Relation<Department>

  @OneToMany(() => Ticket, ticket => ticket.ticketType)
  tickets: Relation<Ticket[]>
}

@Entity({ name: 'tickets'})
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  ticketId: string

  @ManyToOne(() => Account, account => account.createdTickets, { nullable: false })
  @JoinColumn({ name: 'requester' })
  requester: Relation<Account>

  @ManyToOne(() => TicketType, ticketType => ticketType.tickets, { 
    nullable: false,
  })
  @Column({ type: 'char', length: 36 })
  @JoinColumn({ name: 'ticketType' })
  ticketType: Relation<TicketType>

  @OneToMany(() => TicketActivity, ticketActivity => ticketActivity.ticket)
  ticketActivities: Relation<TicketActivity[]>

  @ManyToOne(() => Account, account => account.ticketAssigned)
  @JoinColumn({ name: 'assignee' })
  assignee: Relation<Account>
}

@Entity({ name: 'ticketActivities' })
export class TicketActivity {
  @ManyToOne(() => Ticket, ticket => ticket.ticketActivities)
  @JoinColumn({ name: 'ticketId' })
  ticket: Relation<Ticket>

  @ManyToOne(() => Account, account => account.ticketAssigned)
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

  @ManyToOne(() => Flags, flag => flag.ticketActions)
  @JoinColumn({ name: 'actionPerformed' })
  actionPerformed: Relation<Flags>

  @Column({ nullable: true, type: 'varchar', length: 255 })
  comment: string
}