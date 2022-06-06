import { useRouter } from 'next/router'
import React from 'react'
import { AuthenServices, consumeAPI, UserServices } from '/project/clients/Services'
import { IAuthContext } from '/project/shared'
import { IUserDTO } from '/project/shared'


const AuthContext = React.createContext({ loading: true } as IAuthContext)
export const AuthProvider = (props: { children: any }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string[]>([])
  const [currentUser, setCurrentuser] = React.useState<IUserDTO>()
  const router = useRouter()

  React.useEffect(() => {
    setLoading(true)
    consumeAPI(
      () => AuthenServices
              .verifyHTTPCookieToken()
              .finally(() => setLoading(false)),
      user => { 
        setCurrentuser(user) 
        if(router.pathname == "/login") router.push({ pathname: '/' })
      },
      err => { 
        console.log(err)
        router.push({ pathname: '/login' })
        setError([err.error.message]) 
      }
    )
  }, [])

  function login(username: string, password: string) {
    setError([])
    setLoading(true)
    return consumeAPI(
      () => AuthenServices.login(username, password)
                          .finally(() => setLoading(false)), 
      ({ user }) => {
        if(user){
          setCurrentuser(user)
          router.push({ pathname: '/map' })
          setLoading
        } else {
          setError(["Login return success but unable to parse json return token"])
        }
      }, 
      err => {
        setError(
          "errors" in err.error.details 
            ? err.error.details.errors.map(e => e.message) 
            : [err.error.message])
      })
  }

  function logout(){
    AuthenServices.logout()
    router.push({ pathname: '/login' })
  }

  const context: IAuthContext = {
    loading,
    logout,
    login, 
    currentUser,
    error
  }

  return (
    <AuthContext.Provider value={ context }>
      { props.children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext);