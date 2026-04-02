import Link  from 'next/link';
import  Image  from "next/image";
interface Props {
   title: string;
   image: string;
   slug: string;
   location: string;
   date: string;
   time: string;
}


const EventCard = ({title, image, slug, location, date, time}: Props) => {
   return (
      <Link href={`/events/${slug}`} id="event-card" >
         <Image src={image} alt="EventImg" width={500} height={300} className="poster" />
         <div className='loc'>
            <Image className='icon' src="/icons/pin.svg" alt={location} width={13} height={13} />
            <p>{location}</p>
         </div>
      
         <p className='c_title'>{title}</p>

         <div className='datetime'>
            <div>
               <Image className='icon' src="/icons/calendar.svg" alt='date' width={11} height={11} />
               <p>{date}</p>
            
            </div>
            <div>
               <Image className='clok_icon' src="/icons/clock.svg" alt='time' width={11} height={11} />
               <p>{time}</p>
            
            </div>
         </div>
         
      </Link>
   )
}




export default EventCard
