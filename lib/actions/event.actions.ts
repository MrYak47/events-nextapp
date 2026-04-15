'use server';

import { connectDB } from '@/lib/mongodb';
import Event from '@/database/event.model';


export const getAllEvents = async () => {

   try {
      await connectDB();
      const events = await Event.find().lean();

      console.log("Fetched events: ", events);
      return events;
   
   }catch (error) {
      console.error("Error fetching events:", error);
      return [];
   }

}


export const getEvent = async (slug: string) => {
   try {
      await connectDB();

      const event = await Event.findOne({ slug }).lean();

      if(!event) {
         console.log('No event fount with sug:', slug);
         return null;
      }

      return event
   } catch (error) {
      console.error('Error fetching event:', error);
      return null;
   }
}


export const getSimilarEventsBySlug = async (slug: string) => {
   try {

      const event = await getEvent(slug)

      if(!event) {
         console.log('No event found with slug:', slug);
         return [];
      }

      const similarEvents = await Event.find({ 
         _id: { $ne: event._id },  
         tags: { $in: event.tags } 
      }).lean();
      
      return similarEvents;

   } catch (error) {
      console.error('Error fetching similar events:', error);
      return [];
   }

};





