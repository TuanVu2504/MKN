import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, IListProps, List } from '../components'
import { Toggle } from '../Toggle'
import { useModal } from './ModalContext'
import * as datefns from 'date-fns'

interface ICoreProps {
  readOnly?: boolean,
  required?:boolean,
  label: string,
  proKey: string
  value?: any,
  error?: string,
  verify?: TSyncVerify<any> | TAsyncVerify<any>
}

interface IModaleInputState {
  title: string,
  open: boolean,
  payload: JSX.Element,
  errors: { proKey: string, error: string }[],
  config: {
    cols: number
  },
  data: Record<string, any>
  // IModalInputPropsConfig<any>[]
}

export type IOpenModalParams<T> = 
  Partial<IModaleInputState> 
  & Pick<IModaleInputState, "title"|"payload"> 
  & { callback: (val: T) => Promise<void> }

interface IModalInputContext {
  modalInputState: IModaleInputState
  handler: {
    setContext: React.Dispatch<React.SetStateAction<IModaleInputState>>
    close: () => void
    open: <T=any>(params: IOpenModalParams<T>) => void
  },
}

type TAsyncVerify<T> = (val: T) => Promise<string|undefined>
type TSyncVerify<T> = (val: T) => string|undefined

const defaultState: IModaleInputState = {
  data: {},
  config: { cols: 1 },
  errors: [],
  open: false,
  title: 'Title',
  payload: <div>default payload</div>,
}

export const ModalInputContext  = React.createContext({} as IModalInputContext)

export const ModalInputProvider = React.memo((props: { children: any }) => {
  const { children } = props
  const [modalInputState, setModalUInputState] = React.useState<IModaleInputState>(defaultState)
  const { config: { cols } } = modalInputState
  const modalContext = useModal()
  const callBackRef = React.useRef<(val: any) => Promise<any>>()

  const confim = () => {
    if(modalInputState.errors.length > 0) return
    if(callBackRef.current) {
      callBackRef.current(modalInputState.data)
        .catch(modalContext.handler.error)
    }
  }

  function close(){
    if(callBackRef.current) callBackRef.current = undefined
    setModalUInputState(defaultState)
  }

  const modalInputContext: IModalInputContext = {
    modalInputState,
    handler: {
      setContext: setModalUInputState,
      open: openModal,
      close: close,
    }
  }

  function openModal<T>(params:IOpenModalParams<T>){
    const { callback, ...rest } = params
    callBackRef.current = callback
    setModalUInputState(s => ({
      ...s, ...rest, open: true,
    }))
  }

  return (
    <ModalInputContext.Provider value={modalInputContext}>
      { children }
      {
        modalInputState.open && createPortal(
          <div className='h-full bg-black/60 flex justify-center fixed z-10 top-0 left-0 w-screen'>
            <div className='-translate-y-[60%] absolute top-[50%] min-w-[600px] flex flex-col shadow-lg bg-white max-w-[50%] max-h-[80%]'>
              {/* title section */}
              <div className='px-4 py-4 font-semibold uppercase tracking-[1px] text-[20px]'>
                { modalInputState.title }
              </div>

              {/* message section */}
              <div className={
                `${cols == 1 ? 'grid-cols-1' : cols == 2 ? 'grid-cols-2' : '' }` +
                ` grid px-4 overflow-auto gap-2`
                }>
              {
                modalInputState.payload
              }
              </div>
              
              {/* control section */}
              <div className='px-4 py-4 flex flex-row justify-end'>
                <div 
                  onClick={close} 
                  className="px-4 py-2 text-black hover:bg-slate-400 cursor-pointer font-semibold bg-sky-100 rounded-md"
                >
                  Cancel
                </div>
                <div
                  onClick={confim} 
                  className={
                      `ml-4 px-4 py-2 hover:bg-sky-500 hover:text-white rounded-md ` 
                    + ` font-semibold cursor-pointer`
                    + `${modalInputState.errors.length > 0 ? ' pointer-events-none bg-gray-500' : ' bg-sky-100'}`
                  }
                >
                  OK
                </div>
              </div>
            </div>
          </div>,
          document.querySelector('#modal-input')!
        )
      }
    </ModalInputContext.Provider>
  )
})


let defaultRowStyle = 'w-full rounded-md border-solid border-[1px] px-2 py-1'

export function useInputModal() { return React.useContext(ModalInputContext) }


export function FiledWrapper(props: React.PropsWithChildren<ICoreProps>) {
  const { children, verify, required, label, readOnly, proKey, value } = props
  const modalInput = useInputModal()
  const { modalInputState: { data } } = modalInput

  const fieldVal = data[proKey]

  const fieldErr = modalInput.modalInputState.errors.find(e => e.proKey == proKey)

  React.useEffect(() => {
    async function check(){
      let _error: string | undefined = undefined
      if(required && !fieldVal){
        _error = `Required field`
      } else if(verify && fieldVal){
        const check = await verify(fieldVal)
        _error = check
      }

      modalInput.handler.setContext(cxt => {
        if(_error){
          return {
            ...cxt,
            errors: fieldErr ? cxt.errors.map(e => e.proKey == proKey ? ({ proKey, error: _error! }) : e)
                            : [...cxt.errors, { proKey, error:_error! }]
          }
        } else {
          return { ...cxt, errors: cxt.errors.filter(e => e.proKey != proKey )}
        }
      })
    }
    const timoutcheck = setTimeout(check, 500)
    return () => { clearTimeout(timoutcheck) }
  }, [fieldVal])

  React.useEffect(() => {
    if(value){
      modalInput.handler.setContext(cxt => ({
        ...cxt, data: Object.assign(cxt.data, { [proKey]: value })
      }))
    }
  }, [value])

  const Child = React.Children.map<ReactNode, ReactNode>(children, child => {
    if(React.isValidElement(child)){
      console.log(child.props.className)
      const newClass = child.props.className + 
        ( fieldErr ? ' border-pink-600' 
          : readOnly ? ' border-gray-500 pointer-events-none' 
          :' border-sky-500' )
      return React.cloneElement(child, {
        className: newClass
      })
    }
    return child
  })

  return <div>
    <FieldLabel label={label} error={fieldErr?.error}  />
    { Child }
  </div>

}

export function FieldLabel(props: { label: string, error?: string }){
  const { label, error } = props
  return <div className='mt-2 text-gray-600'>
    <span className="font-semibold uppercase">{ label }</span>
    <span className='ml-2 text-pink-600 text-[0.875em]'>{error ? error : null }</span>
  </div>
}

interface ITextFieldProps extends ICoreProps {
  value?: string,
  verify?: TAsyncVerify<string> | TSyncVerify<string>
}
function TextField (props: ITextFieldProps){
  const { proKey } = props
  const modalInputContext = useInputModal()
  const modalValue = modalInputContext.modalInputState.data[proKey]
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    modalInputContext.handler.setContext(cxt => ({
      ...cxt, data: Object.assign(cxt.data, { [proKey]: val })
    }))
  }
  return (
    <FiledWrapper {...props}>
      <input 
        value={modalValue||''} 
        onChange={onChange}
        className={defaultRowStyle}
      />
    </FiledWrapper>
  )
}

interface ISelectField<T> extends ICoreProps, IListProps<T> {
  value?: T,
}
function SelectField<T>(props: ISelectField<T>){
  const { value, displayPro, lists, proKey } = props
  const modalInputContext = useInputModal()
  const _className = defaultRowStyle
  const modalVal = value || modalInputContext.modalInputState.data[proKey]
  const valDisplay = modalVal && displayPro && modalVal[displayPro]
  const valString = valDisplay && typeof valDisplay == "string" ? valDisplay 
                                : typeof valDisplay == "object" ? JSON.stringify(valDisplay)
                                : undefined 
  
  const onSelect = (val: T) => {
    modalInputContext.handler.setContext(cxt => ({
      ...cxt, data: Object.assign(cxt.data, { [proKey]: val })
    }))
  }

  return (
    <FiledWrapper {...props}>
      <Toggle.Wrapper 
        className={_className} 
        value={valString} 
        type="block"
      >
        <Toggle.Button />
        <Toggle.Hide>
          <List 
            onSelect={onSelect}
            lists={lists} 
            displayPro={displayPro}
          />
        </Toggle.Hide>
      </Toggle.Wrapper>
    </FiledWrapper>
  )
}

export interface IDatePickerProps extends ICoreProps {
  value?:number
}
function DatePicker(props: IDatePickerProps){
  const { value, proKey, } = props
  const modalInputContext = useInputModal()
  const modalVal = value || modalInputContext.modalInputState.data[proKey] || new Date().getTime()
  const onDateChange = (date: number) => {
    modalInputContext.handler.setContext(cxt => ({
      ...cxt,
      data: Object.assign(cxt.data, { [proKey]: date })
    }))
  }
  return (
    <FiledWrapper {...props}>
      <Toggle.Wrapper 
        permanent={true}
        className={defaultRowStyle}
        type='block' 
        value={modalVal && datefns.format(modalVal, 'yyyy-MM-dd') || "Date Picker" }
      >
        <Toggle.Button />
        <Toggle.Hide>
          <Calendar 
            className={`bg-white p-3 h-[300px]`}
            dateSelected={modalVal} 
            onDateSelected={onDateChange}
          />
        </Toggle.Hide>
      </Toggle.Wrapper>
    </FiledWrapper> 
  )
}

export class InputModal {
  static TextField = TextField
  static SelectField = SelectField
  static DatePicker = DatePicker
}