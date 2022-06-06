import React, { ReactNode } from 'react'
import { outsideClick } from '../Hooks'

interface IToggleProps {
  type: "inline" | "block",
  width?: number, height?: number,
  className?: string,
  value?: string | number,
  permanent?:boolean
}

interface IToggleState {
  show: boolean,
  rect: Omit<DOMRect, "toJSON">,
}
interface IToggleContext {
  state: IToggleState,
  props: IToggleProps,
  setState: React.Dispatch<React.SetStateAction<IToggleState>>
}

const ToggleContext = React.createContext<IToggleContext>({} as IToggleContext)
const useToggleContext = () => React.useContext(ToggleContext)

function ToggleWrapper(props: React.PropsWithChildren<any>){
  const { permanent } = props
  const [state, setState] = React.useState<IToggleState>({
    show: false,
    rect: { width: 0, height: 0, left:0, right: 0, top:0, bottom: 0, x: 0, y: 0 }
  })
  const comRef = React.useRef<HTMLDivElement>()
  const componentLoad = React.useCallback((e:HTMLDivElement) => {
    if(e){
      comRef.current = e
      setState(cxt => ({ ...cxt, rect: e.getBoundingClientRect()}))
    }
  }, [])
  const context: IToggleContext ={
    props, state, setState
  }

  outsideClick(comRef, () => { if(permanent) setState(cxt => ({ ...cxt, show: false }))})

  return <ToggleContext.Provider value={context}>
    <div ref={componentLoad}>
      { props.children }
    </div>
  </ToggleContext.Provider>
}

function ToggleButton(){
  const { props, state, setState } = useToggleContext()
  const { permanent, type, className, value } = props
  const butRef = React.useRef<HTMLDivElement>()
  outsideClick(butRef, () => { if(!permanent) setState(cxt => ({ ...cxt, show: false })) })
  const defaultClassname = 'py-[2px] px-2 rounded-md border-sky-500 border-[1px] border-solid'
  return (
    <div ref={e => butRef.current = e || undefined }
    className={`cursor-pointer w-full h-full
      ${type == "inline" ? " inline-block" : " block"}
      ${className ? ` ${className}`:defaultClassname}
    `}
      onClick={() => { setState(cxt => ({ ...cxt, show: !cxt.show })) }}>
      { value || "Click to select" }
    </div>
  )
}

function ToggleHide(props: React.PropsWithChildren<any>){

  const { state: { show, rect }} = useToggleContext()

  const childwithnewclass = React.Children.map<ReactNode, ReactNode>(props.children, child => {
    if(React.isValidElement(child)){
      return React.cloneElement(child, { 
        className: `${child.props.className} absolute shadow-lg shadow-black/40 z-1 mt-2`,
        style: { minWidth: rect.width }
      })
    }
    return child
  })

  return <>
  {
    show ? childwithnewclass! : null
  }</>
}

export class Toggle {
  static Wrapper = ToggleWrapper
  static Button = ToggleButton
  static Hide = ToggleHide
}