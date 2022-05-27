import { 
  IOperationDBRes, ISQLQuery2, 
  global_constants, TMysqlCompareOperators,
  DBTables, ReturnTableType, TSQLFilter, IDBTickets, ETable
} from '/project/shared'

const { helpers } = global_constants
const MYSQL_DB_ERROR_CODE = {
  PROTOCOL_CONNECTION_LOST: 'PROTOCOL_CONNECTION_LOST',
}

import mysql from 'mysql'

const pool      =    mysql.createPool({
  connectionLimit : 40, //important
  // the new one - mysql80
  host     : process.env.dbhost,
  user     : process.env.dbuser,
  password : process.env.dbpassword,
  database : process.env.dbdatabase,
  debug    : false,
  charset  : 'utf8mb4',
});


export function mysql_query<T = any>(query_string: string){
  return new Promise<T>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) throw err;
      connection.query(query_string, (err, result) => {
        connection.release();
        if(err) {
          reject(err)
        } else {
          resolve(result as T);
        }
      })
    })
  })
}

export const escape = mysql.escape

function buildfilterfromobject(input: any | { [k: string]: { value: number, operator?: TMysqlCompareOperators }}){
  const filter = helpers.entries(input)
          .filter(([k,v]) => v!=undefined&&k!=null&&k!='')
          .map(([k,v]) => {
            const _value    = typeof v != "object" ? v : v.value
            const _operator = typeof v != "object" || v.operator == undefined ? "=" : v.operator
            return '`' + k + '`' + _operator + `${mysql.escape(_value)}`
          })
          // '`' + k + '`' + `=${mysql.escape(v)}` )
  return filter
}

export type QueryFilter<T> = { [k in keyof T]?: string | number } | {
  input: { [K in keyof T]?: string | number | { value: number, operator?: TMysqlCompareOperators }},
  operator: 'AND' | 'OR'
}

/**
 * @description
 * - If params is an object include table columns, it perform filter `AND`
 * - If params include `operator` = `AND` | `OR`, it translate `input` object into array of fitler then join `operator`
 */
export function buildFilter<T>(filter: QueryFilter<T>){
  if("operator" in filter){
    return '(' + buildfilterfromobject(filter.input).join(` ${filter.operator} `) + ')'
  }
  return buildfilterfromobject(filter).join(" AND ")
}


export function buildUpdate<T extends DBTables>(input: Partial<ReturnTableType<T>>){
  return Object.entries(input)
    .filter(([k,v]) => v !== undefined && v !== null && v !== '')
    .map(([k,v]) => `${k}=${mysql.escape(v)}`).join(',')
}


export function Table<TB extends ETable, TBT = ReturnTableType<TB>>(table: TB){
  return {
    /**
     * @description
     * - If params is an object include table columns, it perform filter `AND`
     * - If params include `operator` = `AND` | `OR`, it translate `input` object into array of fitler then join `operator`
     */
    select: (option?: QueryFilter<TBT> | string): Promise<TBT[]> => {
      let query = `SELECT * FROM ${table}`;
      if(option && typeof option == "string") return mysql_query(query) as Promise<TBT[]>

      if(option && typeof option != "string" && Object.values(option).filter(v => v != undefined && v != '' && v != null).length == 0) return [] as any
      query = option && typeof option != "string" ? `${query} WHERE ${buildFilter(option)}` : query;
      return mysql_query(query) as Promise<TBT[]>
    },
    post: (option: Partial<TBT>[]) => {
      const cols = helpers.keys(option[0]);
      const valueslist = option
        .map(ele => cols.map(a => ele[a]==undefined||ele[a]==null||`${ele[a]}`==''?'NULL':mysql.escape(ele[a])).join(','))
        .map(ele => `(${ele})`)
        .join(',')
      const query  = `INSERT INTO ${table} (${cols.map(c => `\`${c}\``).join(',')}) VALUES ${valueslist}`
      return mysql_query(query) as Promise<IOperationDBRes>
    },

    select2: (option?: ISQLQuery2<TBT>) => {
      let __select  =''; let __filter  =''; let __order   =''
      const top = option && "top" in option && option.top
      const filter = option && "filter" in option && option.filter
      const order = option  && "order" in option && option.order
      const props = option  && "props" in option && option.props

      __select = `SELECT${top ? ' TOP ' + top : ''} ${props?props.map(prop => '`'+prop+'`' ).join(","):'*'} FROM ${table}`
      __filter = filter && (!("operator" in filter ) || filter.values.length > 0 ) ? ' WHERE ' + buildFilter2(filter) : ''
      
      if(order){
        __order = ' ORDER BY ' + order.by
        if(order.dir) __order += ' ' + order.dir
      }
      const query = __select + __filter + __order
      return mysql_query(query) as Promise<TBT[]>
    },
    delete: (option: QueryFilter<TBT>) => {
      // safe check
      // never allow a filter object that has undefined value in propety
      // it could lead to remove large of data rows
      const checkNullEmptyUndefinedValud = (v:unknown) => v == undefined || v == '' || v == null
      if(("operator" in option && Object.values(option.input).some(checkNullEmptyUndefinedValud))
      || Object.values(option).some(checkNullEmptyUndefinedValud)){
        console.log(option)
        throw new Error(`Unexpected delete filter detected, DANGEROUS CASE`)
      }
      const query = `DELETE FROM ${table} WHERE ${buildFilter(option)}`;
      return mysql_query(query) as Promise<IOperationDBRes>
    },
    update: (option: { where?: QueryFilter<TBT>, update: Partial<ReturnTableType<TB>> }) => {
      const _filter = option.where ? buildFilter(option.where) : undefined
      const _update = buildUpdate(option.update)
      let query = `UPDATE ${table} SET ${_update}`;
      query += _filter ? ` WHERE ${_filter}` : ''
      return mysql_query(query) as Promise<IOperationDBRes>
    }
  }
}

export function buildFilter2<TBT>(input: TSQLFilter<TBT>): string {
  let filterString = ''
  if("operator" in input){
    const { values, operator } = input
    filterString = values.filter(val => {
      return Object.entries(val).some(([k,v]) => {
        if(k === "compare") return true
        const __val = v as undefined | number | null | string
        if(__val !== undefined && __val !== null && __val !== '') return true
        return false
      })
    })
    .map(_val => {
      const { compare, ...rest } = _val
      const __compare = compare || "="
      const pro = Object.keys(rest)[0]
      const val = Object.values(rest)[0]
      return `"${pro}" ${__compare} '${val}'`
    }).join(` ${operator} `)
  } else {
    const { compare, ...rest } = input
    const __compare = compare || "=" 
    const pro = Object.keys(rest)[0]
    const val = Object.values(rest)[0]
    filterString = `"${pro}" ${__compare} '${val}'`
  }

  return filterString
}

async function getCoordOfTicket (ticket: IDBTickets){
  return mysql_query<ReturnTableType<ETable.coordinates>[]>(
    `
    SELECT * FROM ${ETable.coordinates} WHERE coordId = (
      SELECT coordId FROM ${ETable.ticketLocation} WHERE ticketId = '${ticket.ticketId}'
    )
    `
  ).then(res => res[0] )
}

async function getItemSetOfTicket(ticket: IDBTickets){
  return mysql_query<ReturnTableType<ETable.itemSet>[]>(
    `
    SELECT * FROM ${ETable.itemSet} WHERE itemSetId = (
      SELECT itemSetId FROM ${ETable.ticketItemSet} WHERE ticketId = '${ticket.ticketId}'
    )
    `
  ).then(res => res[0] )
}

const staticQuery = {
  getCoordOfTicket,
  getItemSetOfTicket,
}

export class MKNDB {
  static Table = Table
  static query = mysql_query
  static staticQuery = staticQuery
  static ETable = ETable
}
