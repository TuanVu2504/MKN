import { useRouter } from 'next/router'
import React from 'react'
import { AuthenServices, Fetch, consumeAPI, UserServices } from '/project/clients/Services'
import { IAuthContext, IJWTToken, parseJWT, settings } from '/project/shared'
import { IUserInfo } from '/project/shared'


const AuthContext = React.createContext({ loading: true } as IAuthContext)
export const AuthProvider = (props: { children: any }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string[]>([])
  const [currentUser, setCurrentuser] = React.useState<IUserInfo>()
  const router = useRouter()

  React.useEffect(() => {
    const saveToken = localStorage.getItem(settings.auth_token_name) 
    /**
     * If no token => not authenticated
     */
    if(!saveToken) {
      router.push({ pathname: '/login' })
      setError(['Please login'])
      return
    } 
    
    const { exp, id } = parseJWT<IJWTToken>(saveToken)

    /**
     * If token, but expired => expired session => removeItem from localStorage
     */
    if(exp * 1000 < new Date().getTime()){
      localStorage.removeItem(settings.auth_token_name)
      router.push({ pathname: '/login' })
      setError(['Session expired'])
      return
    }

    /**
     * If everything fine, 
     *  - set token from localStrorage to Fetch class
     *  - get user detail base on id and update context
     */
    Fetch.authorization_token = saveToken
    setLoading(true)
    consumeAPI(
      () => UserServices.getUserByID(id).finally(() => setLoading(false)),
      user => { 
        setCurrentuser(user) 
        if(router.pathname == "/login") router.push({ pathname: '/' })
      },
      err => setError([err.error.message])
    )
  }, [])

  function login(username: string, password: string) {
    setError([])
    setLoading(true)
    return consumeAPI(
      () => AuthenServices.login(username, password)
                          .finally(() => setLoading(false)), 
      ({ user, jwt }) => {
        if(jwt && user){
          Fetch.authorization_token = jwt
          setCurrentuser(user)
          localStorage.setItem(settings.auth_token_name, jwt)
          router.push({ pathname: '/' })
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
    // clear token from localStorage
    localStorage.removeItem(settings.auth_token_name)
    Fetch.authorization_token = undefined
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