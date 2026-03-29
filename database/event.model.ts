import { Schema, model, Document, Model, models } from 'mongoose';

/**
 * MongooseUpdatePayload represents the structure of MongoDB update operations
 */
interface MongooseUpdatePayload {
   $set?: Record<string, unknown>;
   [key: string]: unknown;
}

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
<<<<<<< HEAD
      .replace(/\s/g, '-') // Replace spaces with hyphens
      .replace(/-/g, '-'); // Replace multiple hyphens with single hyphen
=======
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
   
   if (!slug) {
      throw new Error('Title must contain at least one alphanumeric character for slug generation');
   }
   return slug;
>>>>>>> cc5b8aef6cf7b6d92e7a466ba4709eba962723ad
};

/**
 * Validate and normalize date to ISO format (YYYY-MM-DD)
 */
const normalizeDate = (date: string): string => {
   
   const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
   if (!match) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD.');
   }

   const year = Number(match[1]);
   const month = Number(match[2]);
   const day = Number(match[3]);
   const utc = new Date(Date.UTC(year, month - 1, day));

   if ( utc.getUTCFullYear() !== year ||
         utc.getUTCMonth() !== month - 1 ||
         utc.getUTCDate() !== day
   ) {
         throw new Error('Invalid calendar date.');
      }

      return `${match[1]}-${match[2]}-${match[3]}`;
   
};

/**
 * Validate and normalize time to HH:mm format
 */
const normalizeTime = (time: string): string => {
   const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
   if (!timeRegex.test(time)) {
      throw new Error('Invalid time format. Please use HH:mm format (e.g., 09:00).');
   }
   const [hours, minutes] = time.split(':');
   return `${hours.padStart(2, '0')}:${minutes}`;
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

// Pre-findOneAndUpdate hook to normalize date/time, generate slug, and validate required fields
eventSchema.pre('findOneAndUpdate', function (next) {
   const update = this.getUpdate();

   if (!update || typeof update !== 'object') {
      return next();
   }

   // Handle both direct field updates and $set operator updates
   const updatePayload = (update as MongooseUpdatePayload).$set || update;

   try {
      // Normalize date if present in update
      if (updatePayload.date) {
         updatePayload.date = normalizeDate(updatePayload.date as string);
      }

      // Normalize time if present in update
      if (updatePayload.time) {
         updatePayload.time = normalizeTime(updatePayload.time as string);
      }

      // Generate slug if title is present in update
      if (updatePayload.title) {
         updatePayload.slug = generateSlug(updatePayload.title as string);
      }

      // Validate required fields in update
      const requiredFields: (keyof EventDocument)[] = ['title', 'description', 'overview', 'image', 'venue', 'location', 'organizer'];
      for (const field of requiredFields) {
         if (field in updatePayload) {
            const value = updatePayload[field];
            if (!value || (typeof value === 'string' && (value as string).trim() === '')) {
               return next(new Error(`${field} cannot be empty`));
            }
         }
      }

      // Apply changes back to the update object
      if ((update as MongooseUpdatePayload).$set) {
         (update as MongooseUpdatePayload).$set = updatePayload as Record<string, unknown>;
      }
   } catch (error) {
      return next(error as Error);
   }

   next();
});

// Pre-updateOne hook for direct updateOne operations
eventSchema.pre('updateOne', function (next) {
   const update = this.getUpdate();

   if (!update || typeof update !== 'object') {
      return next();
   }

   // Handle both direct field updates and $set operator updates
   const updatePayload = (update as MongooseUpdatePayload).$set || update;

   try {
      // Normalize date if present in update
      if (updatePayload.date) {
         updatePayload.date = normalizeDate(updatePayload.date as string);
      }

      // Normalize time if present in update
      if (updatePayload.time) {
         updatePayload.time = normalizeTime(updatePayload.time as string);
      }

      // Generate slug if title is present in update
      if (updatePayload.title) {
         updatePayload.slug = generateSlug(updatePayload.title as string);
      }

      // Validate required fields in update
      const requiredFields: (keyof EventDocument)[] = ['title', 'description', 'overview', 'image', 'venue', 'location', 'organizer'];
      for (const field of requiredFields) {
         if (field in updatePayload) {
            const value = updatePayload[field];
            if (!value || (typeof value === 'string' && (value as string).trim() === '')) {
               return next(new Error(`${field} cannot be empty`));
            }
         }
      }

      // Apply changes back to the update object
      if ((update as MongooseUpdatePayload).$set) {
         (update as MongooseUpdatePayload).$set = updatePayload as Record<string, unknown>;
      }
   } catch (error) {
      return next(error as Error);
   }

   next();
});

// Pre-findByIdAndUpdate hook for findByIdAndUpdate operations
eventSchema.pre('findByOneAndUpdate', function (next) {
   const update = this.getUpdate();

   if (!update || typeof update !== 'object') {
      return next();
   }

   // Handle both direct field updates and $set operator updates
   const updatePayload = (update as MongooseUpdatePayload).$set || update;

   try {
      // Normalize date if present in update
      if (updatePayload.date) {
         updatePayload.date = normalizeDate(updatePayload.date as string);
      }

      // Normalize time if present in update
      if (updatePayload.time) {
         updatePayload.time = normalizeTime(updatePayload.time as string);
      }

      // Generate slug if title is present in update
      if (updatePayload.title) {
         updatePayload.slug = generateSlug(updatePayload.title as string);
      }

      // Validate required fields in update
      const requiredFields: (keyof EventDocument)[] = ['title', 'description', 'overview', 'image', 'venue', 'location', 'organizer'];
      for (const field of requiredFields) {
         if (field in updatePayload) {
            const value = updatePayload[field];
            if (!value || (typeof value === 'string' && (value as string).trim() === '')) {
               return next(new Error(`${field} cannot be empty`));
            }
         }
      }

      // Apply changes back to the update object
      if ((update as MongooseUpdatePayload).$set) {
         (update as MongooseUpdatePayload).$set = updatePayload as Record<string, unknown>;
      }
   } catch (error) {
      return next(error as Error);
   }

   next();
});

/**
 * Event Model - represents a developer event/conference/meetup
 * Reuse existing model during Next.js hot-reload to avoid OverwriteModelError
 */
const Event: Model<EventDocument> = (models.Event as Model<EventDocument>) || model<EventDocument>('Event', eventSchema);

export default Event;
