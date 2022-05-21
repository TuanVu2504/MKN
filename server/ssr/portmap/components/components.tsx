import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { outsideClick } from './Hooks'


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
export interface IDropListProp<T> {
  btnClass?: string,
  children: string,
  displayName?: keyof T,
  align?: ItemAlign[],
  lists: (T & { 
    willDisplay?: boolean
    onClick?: () => void
  })[]
}
const doAlign = (align?: ItemAlign[]) => { 
  if(!align) return ''
  return align.map(e => e + '-0').join(' ')
}

export const DropList = <T,>(props: IDropListProp<T>) => {
  const { children, lists, displayName, align, btnClass } = props
  const buttonRef = React.useRef<HTMLDivElement>(null)
  const [expand, setExpand] = React.useState(false)

  const clickHide   = () => { setExpand(false) }
  const toggle = () => setExpand(s => !s)
  outsideClick(buttonRef, clickHide)

  return (
    <div className='text-white inline-block font-semibold relative'>
      <div 
        ref={buttonRef} 
        className={ 
          btnClass ? btnClass :
          `bg-sky-700 hover:text-sky-700 hover:bg-sky-100 px-6 py-2 cursor-pointer rounded-lg` 
        }
        onClick={toggle}>
        { children }
      </div>
      {
        expand ? 
        <div 
          className={
            `bg-sky-700`
            + ` absolute z-10 shadow-md mt-2`
            + ` ${doAlign(align)}`
          }>
        {
          lists.map((item, kIndex) => {
            const { onClick, willDisplay = true } = item
            const itemClick = () => {
              if(onClick) onClick()
            }
            return ( willDisplay && 
              <div 
                key={kIndex} 
                className={
                    `whitespace-nowrap`
                  + ` hover:text-sky-700 hover:bg-sky-100`
                  + ` cursor-pointer px-6 py-2`
                } 
                onClick={itemClick}>
                { 
                  displayName 
                    ? `${item[displayName]}`
                    : JSON.stringify(item)
                }
              </div>
            )
          })
        }
        </div>
        :null
      }
    </div>
  )
}



export function ActionButton(props: {
  disabled?: boolean,
  loading?: boolean,
  text: string,
  onClick: () => void
}){
  let _style = "flex min-w-100p flex-row py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-900 items-center"
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