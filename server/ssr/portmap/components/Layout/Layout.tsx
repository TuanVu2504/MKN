import React from 'react'


export const PageLayout = (props: { children: any }) => {


  return (
    <div>
      <div>main navigation left page</div>
      <div>
        {props.children}
      </div>
    </div>
  )
}