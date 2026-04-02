'use server';

import { connectDB } from '@/lib/mongodb';
import Event from '@/database/event.model';

export const getSimilarEventsBySlug = async (slug: string) => {
   try {
      await connectDB();

      const event = await Event.findOne({ slug }).lean();
      console.log('Event found:', event);
      
      if(!event) {
         console.log('No event found with slug:', slug);
         return [];
      }

      console.log('Event tags:', event.tags);
      const similarEvents = await Event.find({ 
         _id: { $ne: event._id },  
         tags: { $in: event.tags } 
      }).lean();
      
      console.log('Similar events found:', similarEvents.length);
      return similarEvents;

   } catch (error) {
      console.error('Error fetching similar events:', error);
      return [];
   }

};





