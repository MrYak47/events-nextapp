import React from 'react'
import "./dash.css"


const layout = ( {children }: {children: React.ReactNode}) => {
   return (
      <div>
         <p>Dashboard NavBar</p>
         {children}
      </div>
   )
}

export default layout
