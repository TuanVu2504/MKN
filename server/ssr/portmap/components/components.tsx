import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import * as datefns from 'date-fns'
import { sortLargeToSmall } from '/project/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Toggle } from './Toggle'

export function Spiner(props?:{
  size?: number, color?:string, className?:string
}){
  let style = 'spinner animate-spin'
  if(props?.className) style += ` ${props.className}`
  let strokeWidth = 1
  let pathStyle = "path"
  if(props?.color){
    pathStyle += ` ${props.color}`
  }
  if(props && props.size){
    switch(props.size){
      case 1: style += ' w-1 h-1'; strokeWidth = 1; break
      case 2: style += ' w-2 h-2'; strokeWidth = 2; break
      case 3: style += ' w-3 h-3'; strokeWidth = 3; break
      case 4: style += ' w-4 h-4'; strokeWidth = 4; break
      case 5: style += ' w-5 h-5'; strokeWidth = 5; break
      case 6: style += ' w-6 h-6'; strokeWidth = 6; break
      default: style += ' w-4 h-4'; strokeWidth = 4
    }
  } else { style+= ' w-2 h-2'; strokeWidth = 2 }

  return (
    <svg className={style} viewBox="0 0 50 50">
      <circle className={pathStyle} cx="25" cy="25" r="20" fill="none" strokeWidth={strokeWidth}></circle>
    </svg>
  )
}


type ItemAlign = "left" | "right" | "top" | "bottom"
const doAlign = (align?: ItemAlign[]) => { 
  if(!align) return ''
  return align.map(e => e + '-0').join(' ')
}


export interface ICalendarProps {
  onDateSelected: (date: number) => void,
  dateSelected?: number,
  children?: string,
  className?: string,
}
const monthMap = [{ num: 0, name: 'Jan'},{ num: 1, name: 'Feb'},{ num: 2, name: 'Mar'},{ num: 3, name: 'Apr'},{ num: 4, name: 'May'},{ num: 5, name: 'Jun'},{ num: 6, name: 'Jul'},{ num: 7, name: 'Aug'},{ num: 8, name: 'Sep'}, { num: 9, name: 'Oct'},{ num: 10, name: 'Nov'},{ num: 11, name: 'Dec'}]
const yearMap = Array.from(new Array(new Date().getFullYear() - 1970 + 1)).map((e,i) => ({ num: i+1970, name: i+1970 }))
export const Calendar = ((props: ICalendarProps) => {
  const _today = new Date()
  const { onDateSelected, dateSelected, children, className } = props
  const [currentMonth, setCurrentMonth] = React.useState(new Date(dateSelected||_today));

  const renderHeader = () => {
    return (
      <div className="w-full flex flex-row items-center">
        <div className="w-[30px] cursor-pointer text-center" onClick={ prevMonth }>
          <div className="icon left">
            <FontAwesomeIcon icon={["fas", "chevron-left"]} size="sm" />
          </div>
        </div>
        <div className="flex flex-row w-[250px] justify-around">
          <Toggle.Wrapper 
            className='flex-[100px] text-center' 
            type="inline" 
            value={datefns.format(currentMonth, 'MMM')}>
            <Toggle.Button />
            <Toggle.Hide>
              <List 
                displayPro='name'
                onSelect={monthmap => setCurrentMonth(month => datefns.setMonth(month, monthmap.num))}
                lists={monthMap} 
              />
            </Toggle.Hide>
          </Toggle.Wrapper>
          <Toggle.Wrapper 
            className="flex-[100px] text-center" 
            type="inline" 
            value={datefns.format(currentMonth, 'yyyy')}>
            <Toggle.Button />
            <Toggle.Hide>
              <List 
                displayPro='name'
                onSelect={year => setCurrentMonth(month => datefns.setYear(month, year.num))}
                lists={yearMap.sort(sortLargeToSmall({ by: "num" }))} 
              />
            </Toggle.Hide>
            
          </Toggle.Wrapper>
        </div>
        <div className="w-[30px] cursor-pointer text-center" onClick={ nextMonth }>
          <div className="icon right">
            <FontAwesomeIcon icon={["fas", "chevron-right"]} size="sm" />
          </div>
        </div>
      </div>
    );
  }
    
  const renderDays = () => {
    const dateFormat = "eee";
    const days = [];

    let startDate = datefns.startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="w-10 h-8 leading-8 text-center text-[12px] text-gray-500" key={i}>
          {datefns.format(datefns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="flex flex-row">{days}</div>;
  }
    
  const renderCells = () => {
    const monthStart = datefns.startOfMonth(currentMonth);
    const monthEnd = datefns.endOfMonth(monthStart);
    const startDate = datefns.startOfWeek(monthStart);
    const endDate = datefns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let day = startDate
  
    while (day <= endDate) {
      const days = [0,1,2,3,4,5,6].map(i => {
        const cloneDay = new Date(datefns.addDays(day, i).getTime())
        const formattedDate = datefns.format(cloneDay, dateFormat)
        return <div
          className={`cursor-pointer h-8 w-10 leading-8 text-center date text-[11px] hover:bg-sky-500 ${
            !datefns.isSameMonth(cloneDay, monthStart)
              ? 'pointer-events-none bg-gray-400 text-gray-500'
              : dateSelected && datefns.isSameDay(dateSelected, cloneDay)
                ? 'bg-sky-700' 
                : datefns.isSameDay(cloneDay, _today) ? 'bg-sky-500' : ""
            }`}
            key={cloneDay.toString()}
            onClick={() => onDateSelected(cloneDay.getTime()) }
        >
          <span>{formattedDate}</span>
        </div>
      })

      day = datefns.addDays(day, 7);
      rows.push(
        <div className="flex flex-row" key={day.toString()}>
          {days}
        </div>
      );
    }
    return <div className="body">
      {rows}
    </div>;
  }

  const nextMonth = () => setCurrentMonth(month => datefns.addMonths(month, 1));
  const prevMonth = () => setCurrentMonth(month => datefns.subMonths(month, 1));

  return (
    <div 
      className={className}>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
    </div>
  )
})

export function ActionButton(props: {
  disabled?: boolean,
  loading?: boolean,
  text: string,
  onClick: () => void
}){
  let _style = "flex min-w-[100px] flex-row py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-900 items-center"
  if(props.loading || props.disabled) _style += ' pointer-events-none bg-gray-600'
  return (
    <button className={_style} onClick={props.onClick}> 
      <span className='flex-1 flex justify-center'>{ props.loading != undefined && props.loading == true && <Spiner size={4} /> }</span>
      <span className='flex-1'>{ props.text }</span>
      <span className='flex-1 inline-block'></span>
    </button>
  )
}

export const NavLink = (props: React.PropsWithChildren<LinkProps & { activeClassName?:string, children?: React.ReactElement }>) => {
  const { children, activeClassName, ...linkprops } = props
  const { asPath, isReady } = useRouter()
  const child = React.Children.only(children)!
  const childClassName = child && child.props && child.props.className || ''
  const [className, setClassName] = React.useState(childClassName)

  React.useEffect(() => {
    if(isReady){
      const linkPathName = new URL((props.as || props.href).toString(), location.href).pathname
      const activePathName = new URL(asPath, location.href).pathname

      const newClassName = 
        linkPathName === activePathName 
          ? `${childClassName} ${activeClassName}`.trim().replace(/hover:([^\s]+)/ig, '')
          : childClassName

      if(newClassName !== className) setClassName(newClassName)
    }
  }, [asPath, isReady, props.as, props.href, childClassName, activeClassName, setClassName, className ])
  return (
    <Link {...linkprops}>
      {
        React.cloneElement(child, {
          className: className || null
        })
      }
    </Link>
  )
}

export interface IListProps<T> {
  displayPro?: keyof T,
  align?: ItemAlign[],
  lists: T[]
  onSelect?: (select: T) => void,
  className?: string,
  style?: React.CSSProperties
}
export function List<T>(props: IListProps<T>){
  const { lists, displayPro, align, onSelect, className, style } = props
  return (
    <div 
      style={style}
      className={
        `${className||''}`
        + ` max-h-[200px] overflow-auto bg-white`
        + ` z-10`
        + ` ${doAlign(align)}`
      }>
      {
        lists.map((item, kIndex) => {
          const itemClick = () => {
            if(onSelect) onSelect(item)
          }
          return (  
            <div 
              key={kIndex} 
              className={
                  `whitespace-nowrap w-full`
                + ` hover:text-sky-700 hover:bg-sky-100`
                + ` cursor-pointer px-6 py-2`
              } 
              onClick={itemClick}>
              { 
                displayPro 
                  ? `${item[displayPro]}`
                  : JSON.stringify(item)
              }
            </div>
          )
        })
      }
      </div>
  )
}