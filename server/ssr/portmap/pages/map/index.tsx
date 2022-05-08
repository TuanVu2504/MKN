import React from 'react'
import { useAuth } from '../../components'

const map = () => {
  const authContext = useAuth()
  const [pops, setPops] = React.useState([])
  const [boxes, setBoxes] = React.useState([])
  const [showControl, setShowControl] = React.useState(false)
  
  return (
    <div>
      <div>
        
      </div>
      
    </div>
  )
}


export default map