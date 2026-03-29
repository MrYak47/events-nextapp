import { Schema, model, Document, Model } from 'mongoose';

/**
 * EventDocument represents a MongoDB document for an Event
 */
   export interface EventDocument extends Document {
   title: string;
   slug: string;
   description: string;
   overview: string;
   image: string;
   venue: string;
   location: string;
   date: string; // ISO format (YYYY-MM-DD)
   time: string; // HH:mm format (e.g., 09:00, 14:30)
   mode: 'online' | 'offline' | 'hybrid';
   audience: string;
   agenda: string[];
   organizer: string;
   tags: string[];
   createdAt: Date;
   updatedAt: Date;
}

/**
 * Generate URL-friendly slug from title
 * Converts to lowercase, removes special chars, replaces spaces with hyphens
 */
const generateSlug = (title: string): string => {
   const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
   
   if (!slug) {
      throw new Error('Title must contain at least one alphanumeric character for slug generation');
   }
   return slug;
};

/**
 * Validate and normalize date to ISO format (YYYY-MM-DD)
 */
const normalizeDate = (date: string): string => {
   const dateObj = new Date(date);
   if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format. Please provide a valid date.');
   }
   return dateObj.toISOString().split('T')[0];
};

/**
 * Validate and normalize time to HH:mm format
 */
const normalizeTime = (time: string): string => {
   const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
   if (!timeRegex.test(time)) {
      throw new Error('Invalid time format. Please use HH:mm format (e.g., 09:00).');
   }
   return time;
};

const eventSchema = new Schema<EventDocument>(
   {
      title: {
      type: String,
         required: [true, 'Event title is required'],
         trim: true,
         minlength: [3, 'Title must be at least 3 characters long'],
      },
      slug: {
         type: String,
         unique: true,
         sparse: true,
      },
      description: {
         type: String,
         required: [true, 'Event description is required'],
         trim: true,
      },
      overview: {
         type: String,
         required: [true, 'Event overview is required'],
         trim: true,
      },
      image: {
         type: String,
         required: [true, 'Event image URL is required'],
      },
      venue: {
         type: String,
         required: [true, 'Venue is required'],
         trim: true,
      },
      location: {
         type: String,
         required: [true, 'Location is required'],
         trim: true,
      },
      date: {
         type: String,
         required: [true, 'Event date is required'],
      },
      time: {
         type: String,
         required: [true, 'Event time is required'],
      },
      mode: {
         type: String,
         enum: ['online', 'offline', 'hybrid'],
         required: [true, 'Event mode is required'],
      },
      audience: {
         type: String,
         required: [true, 'Target audience is required'],
         trim: true,
      },
      agenda: {
         type: [String],
         required: [true, 'Agenda is required'],
         validate: {
         validator: (v: string[]) => v.length > 0,
         message: 'Agenda must contain at least one item',
         },
      },
      organizer: {
         type: String,
         required: [true, 'Organizer name is required'],
         trim: true,
      },
      tags: {
         type: [String],
         required: [true, 'Tags are required'],
         validate: {
         validator: (v: string[]) => v.length > 0,
         message: 'Tags must contain at least one tag',
         },
      },
   },
   {
      timestamps: true,
   }
);

// Pre-save hook to generate slug, normalize date/time, and validate required fields
eventSchema.pre('save', function (next) {
  // Generate slug only if title is new or modified
   if (!this.slug || this.isModified('title')) {
      this.slug = generateSlug(this.title);
   }

  // Normalize and validate date format
   try {
      this.date = normalizeDate(this.date);
   } catch (error) {
      return next(error as Error);
   }

  // Normalize and validate time format
   try {
      this.time = normalizeTime(this.time);
   } catch (error) {
      return next(error as Error);
   }

  // Validate required fields are non-empty
   const requiredFields = ['title', 'description', 'overview', 'image', 'venue', 'location', 'organizer'];
   for (const field of requiredFields) {
      if (!this[field as keyof EventDocument] || (typeof this[field as keyof EventDocument] === 'string' && (this[field as keyof EventDocument] as string).trim() === '')) {
         return next(new Error(`${field} cannot be empty`));
      }
   }

   next();
});

/**
 * Event Model - represents a developer event/conference/meetup
 */
const Event: Model<EventDocument> = model<EventDocument>('Event', eventSchema);

export default Event;
