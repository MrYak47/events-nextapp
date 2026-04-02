'use client';
import { useState } from 'react';
import React from 'react'

const BookEvent = () => {
   const [email, setEmail] = useState('');
   const [submitted, setSubmitted] = useState(false);


   const handSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      setTimeout(() => {
         setSubmitted(true);
      }, 1000);

   }


   return (
      <div id="book-event">
         {submitted ? (
            <p> Thank you for signing up!</p>
         ): (
            <form onSubmit={handSubmit} className="booking-form">
               <div>
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
