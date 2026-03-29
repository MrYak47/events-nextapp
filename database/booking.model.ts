import { Schema, model, Document, Model, Types } from 'mongoose';
import Event from './event.model';

/**
 * BookingDocument represents a MongoDB document for a Booking
 */
export interface BookingDocument extends Document {
   eventId: Types.ObjectId;
   email: string;
   createdAt: Date;
   updatedAt: Date;
}

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

const bookingSchema = new Schema<BookingDocument>(
   {
      eventId: {
         type: Schema.Types.ObjectId,
         ref: 'Event',
         required: [true, 'Event ID is required'],
         index: true, // Create index for faster queries
      },
      email: {
         type: String,
         required: [true, 'Email is required'],
         lowercase: true,
         trim: true,
         validate: {
         validator: isValidEmail,
         message: 'Please provide a valid email address',
         },
      },
   },
   {
      timestamps: true,
   }
);

bookingSchema.pre('save', async function (next) {
   try {
      // Verify that the referenced event exists
         if (this.isNew || this.isModified('eventId')) {
            const eventExists = await Event.findById(this.eventId);
            if (!eventExists) {
               return next(new Error(`Event with ID ${this.eventId} does not exist`));
            }
         }

         next();

   } catch (error) {
      next(error as Error);
   }
});

/**
 * Booking Model - represents a user booking/registration for an event
 */
const Booking: Model<BookingDocument> = model<BookingDocument>('Booking', bookingSchema);

export default Booking;
