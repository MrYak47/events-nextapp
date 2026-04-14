
import React, { Suspense } from 'react'
import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import { IEvent } from '@/database/event.model'
import { cacheLife } from 'next/cache';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function EventsList() {
   'use cache';

   try {
      cacheLife('hours');
      const response = await fetch(`${BASE_URL}/api/events`);
      if (!response.ok) {
         throw new Error(`Failed to fetch events: ${response.status}`);
      }
      const { events } = await response.json();

      return (
         <ul className='events'>
            {events && events.length > 0 && events.map((event: IEvent) => (
               <li key={event._id as unknown as string}>
                  <EventCard {...event} />
               </li>
            ))}
         </ul>
      );
   } catch (error) {
      console.error('Error loading events:', error);
      return (
         <ul className='events'>
            <li>Failed to load events. Please try again later.</li>
         </ul>
      );
   }
}


function EventsLoadingFallback() {
   return (
      <ul className='events'>
         <li>Loading events...</li>
      </ul>
   );
}


const Home = () => {
   

   return (
      <section>
         <h1 className='main-head'>The Hub for Every Dev <br /> Event You Can&apos;t Miss</h1>
         <p className="subhead" >Hackathons, Meetups, and Conferences, All in One Place</p>
         <ExploreBtn />

         <div className='ft-events'>
            <h3>Featured Events</h3>

            <Suspense fallback={<EventsLoadingFallback />}>
               <EventsList />
            </Suspense>

         </div>
      </section>
   )
}


export default Home
