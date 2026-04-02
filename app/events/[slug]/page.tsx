import React from 'react';
import { notFound } from "next/navigation";
import { Suspense } from 'react';
import Image from 'next/image';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import '../event.css';
import  BookEvent  from '@/components/BookEvent';
import { IEvent } from '@/database/event.model';
import EventCard from '@/components/EventCard';



const EventDetItem = ({ icon, alt, label }: { icon: string; alt: string; label: string;}) => (
   <div className='icon'>
      <Image src={icon} alt={alt} width={18} height={18} />
      <p>{label}</p>
   </div>
);


const EventAgenda = ({ agendaI }: { agendaI: string[] }) => (
   <div className="agenda">
      <h2>Agenda</h2>
      <ul>
         {agendaI.map((item) => (
            <li key={item}>{item}</li>
         ))}
      </ul>
   </div>
);


const EventTags = ({ tags }: { tags: string[] }) => (
   <div className='tags' >
      {tags.map((tag) => (
         <div className="pill" key={tag}> {tag}</div>
      ))}
   </div>
)




async function Event({params}: { params: Promise<{ slug: string }>}) {
   const { slug } = await params;
   const bookings = 10;

   
   try {


      const request = await fetch(`${BASE_URL}/api/events/${encodeURIComponent(slug)}`);
      if (!request.ok) {
         throw new Error(`Failed to fetch event: ${request.status}`);
      }
      const response = await request.json();
      const { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags } = response.data;
      if (!description) return notFound();

      const simEvents: IEvent[] = await getSimilarEventsBySlug(slug);
      

      return (
         <section id="event">
            <div className="header">
               <h1>Event Details: <br /> {slug}</h1>
               <p>{description}</p>
            </div>
            <div className='details'>
               {/* Left Column - Event Content */}
               <div className="content">
                  <Image src={image} alt={slug} width={800} height={800} className="banner" />
               
                  <section className="overview">
                     <h2>Overview</h2>
                     <p>{overview}</p>
                  </section>

                  <section className="event-info">
                     <h2>Event Information</h2>
                     
                     <EventDetItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                     <EventDetItem icon="/icons/clock.svg" alt="clock" label={time} />
                     <EventDetItem icon="/icons/pin.svg" alt="pin" label={location} />
                     <EventDetItem icon="/icons/mode.svg" alt="mode" label={mode} />
                     <EventDetItem icon="/icons/audience.svg" alt="audience" label={audience} />
                  </section>

                  <EventAgenda agendaI={agenda} />

                  <section className="organ">
                     <h2>Organizers</h2>
                     <p>{organizer}</p>
                  </section>            

                  <EventTags tags={ tags } />

               </div>

               {/* Right Column for Booking */}

               <aside className="booking">
                  <div className="signup-card">
                     <h2> Book Your Spot Now! </h2>
                     {bookings > 0 ? ( <p>Join {bookings} others who have already booked thier spot!</p>
                        ): (<p>Be the first to book your spot!</p>)}
                     <BookEvent />
                  </div>
               </aside>
            </div>

            <div className='simevents'>
               <h2>Similar Events</h2>
               <div className='events'>
                  {simEvents.length > 0 ? simEvents.map((simEvent: IEvent) => (
                     <EventCard key={String(simEvent._id)} title={simEvent.title} image={simEvent.image} slug={simEvent.slug} location={simEvent.location} date={simEvent.date} time={simEvent.time} />
                  )) : <p>No similar events found.</p> }
               </div>

            </div>
         </section>
      );
   } catch (error) {
      console.error('Error fetching event:', error);
      return notFound();
   }
}


function EventsLoadingFallback() {
   return (
      <ul className='events'>
         <li>Loading events...</li>
      </ul>
   );
}

const EventDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
   return (
      <Suspense fallback={<EventsLoadingFallback />}>
         <Event params={params} />
      </Suspense>
   )
}

export default EventDetails





