
import React from 'react'
import { TAPIError } from '/project/shared'
import ReactDOM from 'react-dom'

type TModalMessage = string | string[] | JSX.Element | TAPIError
export interface IModalState {
  message: TModalMessage
  title?: string,
}
export interface IModalContext {
  handler: {
    open: (props: IModalState) => void,
    wait: (props: IModalState) => Promise<boolean>
    close:() => void,
    info: (message: TModalMessage) => void,
    error: (message: TModalMessage) => void
  }
}

const ModalContext = 
  React.createContext<IModalContext>({} as IModalContext)


export const ModalProvider = (props: { children: any }) => {
  const [modalState, setModalState] = React.useState<IModalState>({
    title: 'Modal', message: ''
  })
  const waitRef = React.useRef<(params: boolean) => any>()
  const [open,setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)


  function openModal(option: IModalState){
    setModalState(option)
    setOpen(true)
  }

  function close(){
    setModalState({ message: '', title: '' })
    setLoading(false)
    setOpen(false)
    if(waitRef.current) { 
      waitRef.current(false)
      waitRef.current = undefined
    }
  }

  async function wait(props: IModalState): Promise<boolean>{
    openModal(props)
    return new Promise<boolean>(res => {
      waitRef.current = res
    })
  }

  function confirm(){
    if(waitRef.current) waitRef.current(true)
    close()
  }

  function info(message: TModalMessage){
    setOpen(true)
    setModalState(s => ({ title: 'Info', message }))
  }

  function error(message: TModalMessage){
    setOpen(true)
    setModalState(s => ({ title: 'Error', message }))
  }
  
  const modalContext = {
    handler: {
      close, 
      open: openModal,
      wait,
      error,
      info
    }
  }

  return <ModalContext.Provider value={modalContext}>
    {props.children}
    {
      open ? 
      ReactDOM.createPortal(
        <div className='min-h-screen bg-black/60 flex justify-center items-center fixed z-[12] top-0 left-0 w-screen'>
          <div className='min-w-[800px] flex flex-col shadow-lg max-w-[70%] bg-white'>
            <div className='px-4 py-4 font-semibold uppercase tracking-[1px] text-[20px]'>
              { modalState.title }
            </div>
            
            <div className='px-4'>
            {
              typeof modalState.message == "string" 
                ? <div>{modalState.message}</div>
              : Array.isArray(modalState.message) && modalState.message.every((mes) => typeof mes == "string") 
                ? <>
                {
                  modalState.message.map(message => {
                    return <div className='mt-1'>{message}</div>
                  })
                }
                </>
              : "error" in modalState.message 
                ? <div>
                    <div>
                      <span>Code:</span>
                      <span>{modalState.message.error.status}</span>
                    </div>
                    <div>
                      <span>Name:</span>
                      <span>{modalState.message.error.name}</span>
                    </div>
                    <div>
                      <span>Message:</span>
                      <span>{modalState.message.error.message}</span>
                    </div>
                  </div> 
              : React.isValidElement(modalState.message)
                ? modalState.message
              : <code>{modalState.message}</code>

            }
            </div>

            <div className='px-4 py-4 flex flex-row justify-end'>
              <div 
                className='px-4 py-2 text-black hover:bg-slate-400 cursor-pointer font-semibold'
                onClick={close}>
                  Close
              </div>
              { 
                waitRef.current == undefined 
                ? undefined 
                : <div
                    onClick={confirm}
                    className={
                      `${loading ? 'pointer-events-none bg-gray-400 text-gray-600': ''}`
                      + `ml-4 text-center min-w-[120px] px-4 py-2 text-white bg-sky-300 hover:bg-sky-700 hover:text-white`
                      + ` rounded-md font-semibold cursor-pointer`
                    }
                  >
                    OK
                  </div>
              }
            </div>
          </div>
        </div>        
        ,document.querySelector("#modal-info")!
      )
      :undefined
    }
  </ModalContext.Provider>
}

export const useModal = () => React.useContext(ModalContext)