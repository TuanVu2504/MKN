import React from 'react'
import { useAuth, ModalInputProvider, ModalProvider, AppProvider } from '../Contexts'
import { parseRefRect } from '../Hooks'
import { useRouter } from 'next/router'
import { NavLink } from '../components'

export const PageLayout = (props: { children: any }) => {
  const top_header_ref = React.useRef<HTMLDivElement>(null)
  const { height } = parseRefRect(top_header_ref)
  const authContext = useAuth()
  
  if(!authContext.currentUser) return <div></div>
  
  return ( 
    <>
      <ModalProvider>
        <ModalInputProvider>
          <AppProvider>
          
            <div className='min-h-screen flex flex-row'>
              <div className='px-2 py-2 flex flex-col border-r-gray-300 border-solid border'>
                <div style={{ height }}>
                </div>

                <div className='mt-3'>
                  <div className='text-xs ml-4 my-2 text-gray-400 font-semibold uppercase'>tools</div>
                  <NavLink href={'/map'} activeClassName=' bg-sky-700 text-white'>
                    <a className='block mt-2 px-4 py-2 rounded-lg hover:bg-sky-100 hover:text-sky-700 font-semibold cursor-pointer'>
                      Port Map
                    </a>
                  </NavLink>

                  <NavLink href={'/inventory'} activeClassName=' bg-sky-700 text-white'>
                    <a className='block mt-2 px-4 py-2 rounded-lg hover:bg-sky-100 hover:text-sky-700 font-semibold cursor-pointer'>
                      Inventory
                    </a>
                  </NavLink>

                  <NavLink href={'/hr'} activeClassName=' bg-sky-700 text-white'>
                    <a className='block mt-2 px-4 py-2 rounded-lg hover:bg-sky-100 hover:text-sky-700 font-semibold cursor-pointer'>
                      Human Resources
                    </a>
                  </NavLink>

                  <NavLink href={'/chat'} activeClassName=' bg-sky-700 text-white'>
                    <a className='block mt-2 px-4 py-2 rounded-lg hover:bg-sky-100 hover:text-sky-700 font-semibold cursor-pointer'>
                      Chat
                    </a>
                  </NavLink>

                  <NavLink href={'/tickets'} activeClassName=' bg-sky-700 text-white'>
                    <a className='block mt-2 px-4 py-2 rounded-lg hover:bg-sky-100 hover:text-sky-700 font-semibold cursor-pointer'>
                      Tickets
                    </a>
                  </NavLink>

                  <NavLink href={'/admin'} activeClassName=' bg-sky-700 text-white'>
                    <a className='block mt-2 px-4 py-2 rounded-lg hover:bg-sky-100 hover:text-sky-700 font-semibold cursor-pointer'>
                      Admin
                    </a>
                  </NavLink>

                  
                </div>
              </div>
              <div className='flex-1 flex flex-col bg-indigo-50'>
                <CurrentUser ref={top_header_ref} />
                {props.children}
              </div>
            </div>
          </AppProvider>
        </ModalInputProvider>
      </ModalProvider>
    </>
  )
}

const CurrentUser = React.forwardRef<HTMLDivElement>((props, ref) => {
  const authContext = useAuth()
  const { currentUser } = authContext
  const { userName } = currentUser!
  const router = useRouter()
  return (
    <div className='px-8 py-6 flex flex-row items-center border-b border-b-gray-300' ref={ref}>
      <div
        className={`rounded-full w-12 h-12 bg-sky-700 relative flex items-center justify-center` 
                  + ' before:absolute before:w-14 before:h-14 before:rounded-full before:border-[2px] before:border-sky-500'
                  + ' before:-top-1 before:-left-1'
                  + ' font-semibold text-xl text-white'
      }>
        AV
      </div>
      <div className='ml-4 h-full'>
        <div><span className='font-bold text-lg'>Welcome Back,&nbsp;</span><span className='font-semibold'>{userName}</span></div>
        <div>
          <a 
            className={
              `cursor-pointer text-sm text-gray-500` 
              +` hover:text-gray-800 underline underline-offset-1`
            } 
            onClick={ authContext.logout }
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  )
})