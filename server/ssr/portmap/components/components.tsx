import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'



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