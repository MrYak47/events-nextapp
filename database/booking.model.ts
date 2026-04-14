import { Schema, model, Document, Model, Types } from 'mongoose';

/**
 * BookingDocument represents a MongoDB document for a Booking
 */
export interface IBooking extends Document {
   eventId: Types.ObjectId;
   slug: string;
   email: string;
   name: string;
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

const bookingSchema = new Schema<IBooking>(
   {
      eventId: {
         type: Schema.Types.ObjectId,
         ref: 'Event',
         required: [true, 'Event ID is required'],
         index: true, // Create index for faster queries
      },
      slug: {
         type: String,
         required: [true, 'Slug is required'],
         trim: true,
         lowercase: true,
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
      name: {
         type: String,
         required: [true, 'Name is required'],
         trim: true,
         minlength: [2, 'Name must be at least 2 characters long'],
         maxlength: [100, 'Name cannot exceed 100 characters'],
      },
   },
   {
      timestamps: true,
   }
);

/**
 * Booking Model - represents a user booking/registration for an event
 */
const Booking = (() => {
   try {
      return model<IBooking>('Booking');
   } catch (err) {
      return model<IBooking>('Booking', bookingSchema);
   }
})();

export { Booking };

