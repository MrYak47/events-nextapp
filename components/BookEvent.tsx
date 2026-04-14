'use client';
import { useState, FormEvent } from 'react';
import { createBooking } from '@/lib/actions/bookings.actions';
import posthog from 'posthog-js';

const BookEvent = ({eventId, slug}: { eventId: string; slug: string; }) => {
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [submitted, setSubmitted] = useState(false);


   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Client-side validation
      if (!email.trim()) {
         console.error('Email is required');
         return;
      }
      if (!name.trim()) {
         console.error('Name is required');
         return;
      }
      if (name.trim().length < 2) {
         console.error('Name must be at least 2 characters');
         return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         console.error('Invalid email format');
         return;
      }
      
      try {
         const {success, error} = await createBooking({eventId, slug, email: email.trim(), name: name.trim()});

         if(success) {
            // Track booking event with PostHog
            if (posthog && typeof posthog.capture === 'function') {
               posthog.capture('booking_submitted', {
                  eventId,
                  slug,
                  email: email.trim()
               });
            }
            // Show success message after a delay
            setTimeout(() => {
               setSubmitted(true);
            }, 1000);
         } else {
            console.error('Booking creation failed:', error);
         }
      } catch (error) {
         console.error('Error submitting booking:', error);
      }
   }


   return (
      <div id="book-event">
         {submitted ? (
            <p> Thank you for signing up!</p>
         ): (
            <form onSubmit={handleSubmit} className="booking-form">
               <div>
               <label htmlFor="name">Name</label>
                  <input type="text" id="name" value={name} 
                     onChange={(e) => setName(e.target.value)} 
                     placeholder='Enter your name: ' />

                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                     placeholder='Enter your email address' />
               </div>

               <button type="submit" className="button-submit">Submit</button>
            </form>
         )}
         
      </div>
   )
}

export default BookEvent
