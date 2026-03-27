import React from 'react'
import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import { events } from '@/lib/constants';


const Home = () => {

   

   return (
      <section>
         <h1 className='main-head'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
         <p className="subhead" >Hackathons, Meetups, and Conferences, All in One Place</p>
         <ExploreBtn />

         <div className='ft-events'>
            <h3>Featured Events</h3>

            <ul className='events'>
               {events.map((event) => (
                  <li key={event.id}>
                  <EventCard {...event} />
                  </li>
               ))}
               
            </ul>

         </div>


      </section>
   )
}


export default Home
