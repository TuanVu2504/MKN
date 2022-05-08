import React from 'react'
import { useAuth } from '../../components'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

const map = () => {
  const authContext = useAuth()
  const [pops, setPops] = React.useState([])
  const [boxes, setBoxes] = React.useState([])
  const [showControl, setShowControl] = React.useState(false)
  
  return (
    <div>
      <Wrapper apiKey={"AIzaSyAKNGpdR0rVxhgg1N4uf4FMmszL0IqF-_0"}>
        <div>test </div>
      </Wrapper>
    </div>
  )
}


export default map