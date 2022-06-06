import { useRouter } from 'next/router'
import React from 'react'
import { ActionButton, useAuth, registerEnterAction } from '../components'

const Login = () => {
  const [username, setusername] = React.useState("")
  const [password, setpassword] = React.useState("")
  const authContext = useAuth()
  const router = useRouter()
  const btnDisabeld = username == "" || password == ""

  const dispatchLogin = () => authContext.login(username, password)
  registerEnterAction(dispatchLogin)
  
  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <div className='px-8 py-6 mt-4 text-left bg-white shadow-lg w-[500px]'>
        <h3 className="text-2xl font-bold text-center">Welcome to IT System</h3>
        <div className='mt-4'>
          <label className='block ml-4'>Username</label>
          <input
            required
            value={ username }
            type="text"
            className='w-full px-4 mt-2 py-2 border rounded-full outline-none focus:ring-1 focus:ring-blue-600'
            onChange={ e => setusername(e.target.value) } 
          />
        </div>

        <div className='mt-4'>
          <label className='block ml-4'>Password</label>
          <input
            required
            value={ password }
            type="password"
            className='w-full px-4 mt-2 py-2 border rounded-full outline-none focus:ring-1 focus:ring-blue-600'
            onChange={ e => setpassword(e.target.value) } 
          />
        </div>

        <div className='flex items-baseline justify-between mt-4'>
          <ActionButton 
            disabled={btnDisabeld} 
            loading={authContext.loading} 
            onClick={ dispatchLogin } 
            text="Login" 
          />  
        </div>
        <div className='flex flex-col items-baseline mt-4 text-pink-700 text-left'>
        {
          authContext.error.map((err,index) => <div key={index}>{err}</div>)
        }
        </div>
      </div>
    </div>
  )
}

export default Login
