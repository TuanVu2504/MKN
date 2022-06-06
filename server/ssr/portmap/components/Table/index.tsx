import React from 'react'


interface ITableProps<T> {
  tableName?: string,
  children: React.ReactElement<IHeaderProps<T>>
  data: T[],
  className?: string,
  onRowDelete?: (row: T) => void,
  onRowClick?: (row: T) => void
  onAdd?: () => void
}

interface ITableColConfig<T> {
  width?: number
  proKey: keyof T,
  label: string,
  render?: (val: T[keyof T]) => string
}

export interface ITableConfig<T> {
  sort?: { by: keyof T, dir: "ASC" | "DES" },
  finds?: { by: keyof T, val: string }[]
}
export interface ITableContext<T> {
  tableConfig: ITableConfig<T>,
  data: T[],
  colConfig: {
    cols: ITableColConfig<T>[]
  }
  handlers: {
    setHeader: React.Dispatch<React.SetStateAction<ITableColConfig<T>[]>>
    setTableConfig: React.Dispatch<React.SetStateAction<ITableConfig<T>>>
    rowClick?: (row: T) => void
    rowDelete?: (row: T) => void,
    add?: () => void
  }
}

const cellAttributeAddress = "cellAddress"
const TableContext = React.createContext<ITableContext<any>>({} as ITableContext<any>)
export const useTable = <T=any>() => React.useContext(TableContext) as ITableContext<T>
function TableWrapper <T>(props: React.PropsWithChildren<ITableProps<T>>){
  const { children, data, className, onRowClick, onRowDelete, onAdd, tableName } = props

  const tbRef = React.useRef<HTMLDivElement>(null)
  const [cols, _setHeader] = React.useState<ITableColConfig<T>[]>([])
  const [tableConfig, _setTableConfig] = React.useState<ITableConfig<T>>({})
  
  const setHeader = _setHeader
  const setTableConfig = _setTableConfig

  const tableContext:ITableContext<T> = {
    tableConfig,
    data:data,
    colConfig: {
      cols: cols
    },
    handlers: {
      setHeader,
      setTableConfig,
      rowClick: onRowClick,
      rowDelete: onRowDelete,
      add: onAdd,
    }
  }

  const mouseOver = (e: React.MouseEvent) => {

  }

  const mouseOut = (e: React.MouseEvent) => {

  }

  return (
    <TableContext.Provider value={tableContext} >
      <div ref={tbRef} className={
        `flex flex-col `
        + `p-4 w-full bg-white rounded-md ` 
        + `${className||''} `.trim()
      }>
        <div className=''>
          <div className='leading-[40px] flex flex-row justify-between'>
            <div>
              <div className='text-sky-500 font-semibold text-[14px] px-2 leading-[40px]'>
              { tableName && tableName }
              </div>
            </div>

            <div>
            { 
              onAdd ? <div 
                className={
                  `px-2 leading-[40px] font-semibold text-[14px] ` + 
                  `text-gray-500 cursor-pointer hover:text-sky-700`
                }
                onClick={onAdd}
              >
                Add
              </div> 
              : undefined
            }
            </div>
          </div>
        </div>
        <div className=''>
        {
          children
        }
        </div>
        <div className='flex-1 overflow-auto'>
        {
          data.length > 0 &&  cols.length > 0 ?
          data.map( (row, rowIndex) => {

            return (
              <div 
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={
                  `group relative `
                  + `cursor-pointer flex flex-row hover:bg-sky-100`
                  + ` border-solid border-b-[1px] border-gray-200`
                }>
                
                {
                  cols.map((col, colIndex) => {
                    const { proKey, render, width } = col
                    const val = render ? render(row[proKey]) : row[proKey]
                    const customAttr = { [cellAttributeAddress]: JSON.stringify({ rowIndex, colIndex }) }
                    return (
                      <div 
                        key={colIndex} 
                        className={
                          `flex-${width||1} grow-${width||1} ` +
                          `leading-[40px] px-2`
                        }
                        {...customAttr}
                      >
                      {
                        typeof val == "string" ? val
                        : typeof val == "object" ? JSON.stringify(val)
                        : "unknwon render type"
                      }
                      </div>
                    )
                  })
                }
                {
                  onRowDelete && <div 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onRowDelete(row) 
                    }}
                    className={
                      `right-[0]` +
                      ` text-pink-400 hover:text-pink-600 absolute h-[40px] px-4` +
                      ` leading-[40px] group-hover:block hidden z-1`}
                    >
                    Delete
                  </div>
                }
                
              </div>
            ) 
          })
          : undefined
        }
        </div>
      </div>
      
    </TableContext.Provider>
    
  )
}


interface IHeaderProps<T> {
  children: React.ReactElement<ITableColConfig<T>>[] | React.ReactElement<ITableColConfig<T>>
}
function TableRow <T>(props: React.PropsWithChildren<IHeaderProps<T>>) {
  const { children } = props
  return (
    <div className='flex flex-row'>
    {
      children
    }
    </div>
  )
}
function TableHeaderCol <T>(props:ITableColConfig<T>){
  const { proKey, label, width } = props
  const tableContext = useTable<T>()

  React.useEffect(() => {
    tableContext.handlers.setHeader(state => {
      if(state.length == 0 || state.every(h => h.proKey != proKey)){
        return [...state, props]
      } else {
        return state.map(h => h.proKey == proKey ? props : h)
      }
    })
  }, [])

  return (
    <div className={
      `flex-${width||1} grow-${width||1} ` + 
      `leading-[40px] px-2 border-b-[2px] border-solid `+
      `border-gray-500 font-semibold text-gray-500`
    }>
      { 
        label.split(' ')
        .map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
        )
        .join(" ")
      }
    </div>
  )
}

export class Table {
  static Header = TableRow
  static Wrapper = TableWrapper
  static HeaderCol = TableHeaderCol
}