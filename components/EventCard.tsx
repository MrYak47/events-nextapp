import Link  from 'next/link';
import  Image  from "next/image";
import React from 'react'

interface Props {
   title: string;
   image: string;
}


const EventCard = ({title, image}: Props) => {
   return (
      <Link href={`/events`} id="event-card" >
         <Image src={image} alt="EventImg" width={25} height={25} className="poster" />
      
         <p className='c_title'>{title}</p>
         
      </Link>
   )
}




export default EventCard
