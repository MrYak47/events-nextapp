'use server';

import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const createBooking = async ({eventId, slug, email, name}: {
      eventId: string; 
      slug: string;
      email: string;
      name: string; 
   }) => {

   try {
      const conn = await connectDB();
      
      // Validate inputs
      if (!name || name.trim().length < 2) {
         throw new Error('Name must be at least 2 characters');
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         throw new Error('Invalid email format');
      }
      if (!eventId || !slug) {
         throw new Error('Event ID and slug are required');
      }
      
      // Convert string eventId to MongoDB ObjectId
      let objectId: ObjectId;
      try {
         objectId = new ObjectId(eventId);
      } catch {
         throw new Error('Invalid event ID format');
      }
      
      // Use MongoDB driver directly (bypass Mongoose)
      const db = conn.getClient().db(process.env.MONGODB_DB || 'events-nextapp');
      const bookingsCollection = db.collection('bookings');
      
      // Insert booking document directly
      const result = await bookingsCollection.insertOne({
         eventId: objectId,
         slug: slug.toLowerCase().trim(),
         email: email.toLowerCase().trim(),
         name: name.trim(),
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      
      console.log('Booking created successfully:', result.insertedId);
      return { success: true };
      
   } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error creating booking:', errorMessage);
      console.error('Error stack:', errorStack);
      console.error('Booking data:', { eventId, slug, email, name });
      return { success: false, error: errorMessage };
   }




   }




