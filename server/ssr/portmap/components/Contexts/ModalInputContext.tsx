import React from 'react'
import { createPortal } from 'react-dom'
import { DropList, IDropListProp } from '../components'
import { GetKeyMatch } from '/project/shared'

interface IModalInputContext {
  open: <T = any>(config: TModalConfig) => Promise<T|undefined>,
  // addFiled: <T, TConf extends IModalInputPropsConfig<T>>(fieldConfig: TConf) => void
  addTextField: <T>
    (props: Omit<IModalInput<T, keyof T>, "type"> ) => void,
  addSelectRow: <T, TDropListType >
    (props: Omit<IModalSingleSelect<T, keyof T, TDropListType>, "proValue" | "type" >) => void,
  addMultiSelectRow: <T, TDropListType >
    (props: Omit<IModalMultiSelect<T, keyof T, TDropListType>, "proValue" | "type" >) => void,
  addObjectInput: <T, K extends keyof T>
    (props: IModalObjectInput<T, K>) => void,
}

interface IModaleState {
  title: string,
  open: boolean,
  payload: IModalInputPropsConfig<any>[]
}

type TModalConfig = Pick<IModaleState, "title">

type TAsyncVerify<T> = (val: T) => Promise<string|undefined>
type SyncVerify<T> = (val: T) => string|undefined

interface IBaseProp<T> { proKey: keyof T, readOnly?: boolean, label?: string }
type IModalInputPropsConfig<T, K extends keyof T = any> = 
  IModalInput<T, K> 
  | IModalSingleSelect<T, K, any>
  | IModalMultiSelect<T, K, any> 
  | IModalObjectInput<T, K>


export interface IModalInput<T, K extends keyof T> extends IBaseProp<T>{
  proKey: K,
  proValue?: string | number,
  type: "text"
  error?: string
  /**
   * @description
   *  - Return `underfined` mean good
   *  - Return `string` mean error
   */
  verify?: TAsyncVerify<string|number> | SyncVerify<string|number>
}

export interface IModalSingleSelect<
T, 
K extends keyof T,
TDropListType> extends IBaseProp<T> 
{
  proValue?: T[K], 
  type: "sing_select", 
  lists: Omit<IDropListProp<TDropListType>, "children">
  proKey: K,
  verify?: TAsyncVerify<T[K]> | SyncVerify<T[K]>
}

export interface IModalMultiSelect<
  T, 
  K extends keyof T, 
  TDropListType> extends IBaseProp<T> 
{
  proValue?: T[K][], 
  type: "multi_select", 
  lists: Omit<IDropListProp<TDropListType>, "children">, 
  duplicate?: boolean, 
  error?:string
  proKey: K,
  verify?: TAsyncVerify<T[K][]> | SyncVerify<T[K][]>
}

export interface IModalObjectInput<T, K extends keyof T> extends IBaseProp<T> {
  proValue?: T[K], 
  type: { proKey: keyof T[K], label?:string, verify?: TAsyncVerify<string|number> | SyncVerify<string|number> }[]
  proKey: K,
  verify?: TAsyncVerify<T[K]> | SyncVerify<T[K]>
}

export const ModalInputContext  = React.createContext({ } as IModalInputContext)

export const ModalInputProvider = React.memo((props: { children: any }) => {
  const { children } = props
  const [valid, setValid] = React.useState(false)
  const [modalInputState, setModalUInputState] = React.useState<IModaleState>
  ({
    open: false,
    title: 'Title',
    payload: [],
  })
  const asyncRef = React.useRef<(a:any) => any>()

  React.useEffect(() => {
    const run = async () => {
      if(modalInputState.payload.length == 0) return setValid(false)

      const new_state = await Promise.all(modalInputState.payload.map(async row => {
        if(row.proValue && typeof row.type == "string" && row.verify){
          const verifyResult = await row.verify(row.proValue)
          return { ...row, error: verifyResult }
        }
        if(row.proValue != {} && row.proValue != undefined && typeof row.type == "object"){
          const verifyResult = await Promise.all(Object.entries(row.proValue).map( async ([child_proKey, child_proVal]) => {
            const pro_key_conf = modalInputState.payload.find(conf => conf.proKey == row.proKey )
            if(!pro_key_conf || typeof pro_key_conf.type == "string") return undefined
            const pro_child_key_conf = pro_key_conf.type.find(child_key_conf => child_key_conf.proKey == child_proKey)
            if(!pro_child_key_conf || !pro_child_key_conf.verify) return undefined
            const check_res = await pro_child_key_conf.verify(child_proVal as string|number) 
            return check_res
          }))
          .then(result => result.filter(r => r!= undefined) as string[])
          return { ...row, error: verifyResult.length == 0 ? undefined : verifyResult.join(', ') }
        }
        return row
      }))

      if(new_state.every(e => e.proValue && (!("error" in e)||e.error == undefined) )){
        setValid(true)
      } else {
        setValid(false)
      }
      setModalUInputState(s => ({ ...s, payload: new_state }))
    }

    const timeout = setTimeout(run, 500)
    return () => clearTimeout(timeout)
  }, [ JSON.stringify(modalInputState.payload.map(e => e.proValue)) ])

  const openInputModal = <T=any>(config: TModalConfig) => {
    return new Promise<{ [k in keyof T]:T[k] }|undefined>(resolve => {
      setModalUInputState(s => ({ ...s, open: true, ...config }))
      asyncRef.current = resolve
    })
  }

  const addFiled = (fileConfig: IModalInputPropsConfig<any>) => {
    setModalUInputState(s => ({
      ...s, payload: [...s.payload, fileConfig]
    }))
  }

  const cancelInput = () => {
    if(asyncRef.current) asyncRef.current(undefined)
    setModalUInputState(s => ({ ...s, open: false, payload: [] }))
  }

  const confirmInputModal = () => {
    if(!valid) return
    if(asyncRef.current){
      const returnObject = modalInputState.payload.reduce((p,v) => {
        return Object.assign(p, { [v.proKey]: v.proValue })
      }, {})
      asyncRef.current(returnObject)
      alert(JSON.stringify(returnObject, null, 2))
    }
  }

  function addTextField(props: Omit<IModalInput<any, any>, "type">){
    setModalUInputState(s => {
      return { ...s, payload: [...s.payload, ({ ...props, type: "text"})] }
    })
  }

  
  function addSelectRow(props: Omit<IModalSingleSelect<any, any, any>, "type">){
    setModalUInputState(s => ({ ...s,
      payload: [...s.payload, ({ ...props, type:"sing_select"})]
    }))
  }


  function addMultiSelectRow(props: Omit<IModalMultiSelect<any, any, any>, "type" >){
    setModalUInputState(s => ({ ...s,
      payload: [...s.payload, ({ ...props, type: "multi_select"})]
    }))
  }

  function addObjectInput(props: Omit<IModalObjectInput<any, any>, "proValue" >){
    setModalUInputState(s => ({ ...s,
      payload: [...s.payload, props ]
    }))
  }


  const modalInputContext: IModalInputContext = {
    open: openInputModal,
    addObjectInput,
    addMultiSelectRow,
    addSelectRow,
    addTextField
  }

  const modalInputPayloadProChange = (prop: keyof Record<any,any>, value: any) => {
    setModalUInputState(s => ({
      ...s, payload: s.payload.map(mem => {
        if(mem.proKey == prop){
          return ({ ...mem, proValue: value })
        } 
        return mem
      })
    }))
  }


  let defaultRowStyle = 'w-full rounded-md border-solid border-[1px] px-2 py-1'

  return (
    <ModalInputContext.Provider value={modalInputContext}>
      { children }
      {
        modalInputState.open && createPortal(
          <div className='min-h-screen bg-black/60 flex justify-center items-center fixed z-10 top-0 left-0 w-screen'>
            <div className='min-w-[600px] flex flex-col shadow-lg bg-white max-w-[70%]'>
              {/* title section */}
              <div className='px-4 py-4 font-semibold uppercase tracking-[1px] text-[20px]'>
                { modalInputState.title }
              </div>

              {/* message section */}
              <div className='px-4'>
              {
                modalInputState.payload.map(row => {
                  const { proKey, proValue, type, readOnly = false, label } = row
                  let _style = defaultRowStyle
                  if(readOnly){
                    _style += ' pointer-events-none text-gray-300'
                  }
                  if("error" in row && row.error && row.error != '' ){
                    _style += ' border-red-500' 
                  } else {
                    _style += ' border-sky-500'
                  }
                  return (
                    <div key={proKey.toString()}>
                      <div className='mt-2 text-gray-600'>
                        <span className="font-semibold uppercase">{ label || proKey.toString() }</span>
                        <span className='ml-2 text-[red]'>{"error" in row && row.error != '' ? row.error : null }</span>
                      </div>
                      {
                        type == "text" ? <input 
                                            value={proValue|| ''} 
                                            onChange={ e => {
                                              const text = e.target.value
                                              modalInputPayloadProChange(proKey, text)
                                            }}
                                            className={_style}
                                          />
                        : type == "sing_select" ? <div className={_style}>
                                                    <DropList 
                                                      btnClass='text-black cursor-pointer rounded-md border-solid border-[1px] border-sky-500 py-[2px] px-2 inline-block'
                                                      {...row.lists } 
                                                      lists={row.lists.lists.map(e => ({
                                                       ...e, 
                                                       onClick: () => modalInputPayloadProChange(proKey, e)
                                                      }))}
                                                    >
                                                      { 
                                                        proValue && row.lists.displayName ? proValue[row.lists.displayName as keyof {}] 
                                                          : proValue && (typeof proValue == "string" || typeof proValue == "number") ? proValue 
                                                          : typeof proValue == "object" ? JSON.stringify(proValue)
                                                          : "Add" 
                                                      }
                                                    </DropList>
                                                  </div>
                        : type == "multi_select" ? <div className={_style}>
                                                    { proValue ? proValue.map((_proVal, index) => {
                                                      const { displayName } = row.lists
                                                      return <div 
                                                        onClick={() => {
                                                          modalInputPayloadProChange(proKey, proValue.filter((_val, _index) => _index != index) )
                                                        }}
                                                        className='cursor-pointer hover:border-red-600 hover:bg-red-600 rounded-md border-solid border-[1px] border-sky-500 py-[2px] px-2 inline-block mr-[2px]'
                                                        key={index}
                                                      >
                                                        {
                                                          displayName 
                                                            ? _proVal[displayName as keyof {}]
                                                            : (typeof _proVal == "string" || typeof _proVal == "number") ? _proVal
                                                            : JSON.stringify(_proVal)
                                                        }
                                                      </div>
                                                    }) : undefined }
                                                    <DropList
                                                      btnClass='bg-sky-700 hover:text-sky-700 hover:bg-sky-100 py-[2px] px-2 cursor-pointer rounded-lg'
                                                      {...row.lists } 
                                                      lists={row.lists.lists.map((e:any) => ({
                                                       ...e, 
                                                       onClick: () => modalInputPayloadProChange(proKey, (proValue || []).concat([e]))
                                                      }))}
                                                    >
                                                      Add
                                                    </DropList>
                                                  </div>
                        : typeof type == "object" ? type.map((child_ProKey,index) => {
                                                      return (<div key={index} className='flex mb-1'>
                                                        <div className='w-8'></div>
                                                        <div className='flex flex-col w-full'>
                                                          <div className='text-gray-600 uppercase font-semibold text-[12px]'>
                                                            {
                                                              child_ProKey.label || child_ProKey.proKey.toString()
                                                            }
                                                          </div>
                                                          <input 
                                                            className={_style}
                                                            value={proValue ? proValue[child_ProKey.proKey as keyof {}] || "" : ""} 
                                                            onChange={e => {
                                                              if(readOnly) return
                                                              modalInputPayloadProChange(proKey, Object.assign(proValue||{}, { [child_ProKey.proKey as keyof {}]: e.target.value }))
                                                            }}
                                                          />
                                                        </div>


                                                      </div>)
                                                    })
                        : null
                      }
                    </div>
                  )
                })
              }
              </div>
              
              {/* control section */}
              <div className='px-4 py-4 flex flex-row justify-end'>
                <div 
                  onClick={cancelInput} 
                  className="px-4 py-2 text-black hover:bg-slate-400 cursor-pointer font-semibold"
                >
                  Cancel
                </div>
                <div
                  onClick={confirmInputModal} 
                  className={
                      `ml-4 px-4 py-2 text-white bg-sky-700 hover:bg-sky-100 hover:text-sky-700` 
                    + ` font-semibold cursor-pointer`
                    + `${!valid? ' pointer-events-none bg-gray-500' :''}`
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

export function useInputModal() { return React.useContext(ModalInputContext) }