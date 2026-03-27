'use client'
import React from 'react'
import Image from 'next/image'


const ExploreBtn = () => {
   return (
      <button type="button" id='explore-btn' className='explorebtn' onClick={() => console.log('Click')}>
         <a href='#events'>
            Explore Events
            <Image src='./icons/arrow-down.svg' alt="arrow-down" width={30} height={30} />
            
         </a>
      </button>
   )
}

   export default ExploreBtn
