import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/database/event.model';
import { IEvent } from '@/database/event.model';

/**
 * API Response Types for type-safety
 */
interface SuccessResponse {
   success: true;
   data: IEvent;
}

interface ErrorResponse {
   success: false;
   error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Validates and sanitizes slug parameter
 * @param slug - The slug string to validate
 * @returns Sanitized slug or null if invalid
 */
function validateSlug(slug: unknown): string | null {
   // Check if slug exists and is a string
   if (typeof slug !== 'string' || !slug.trim()) {
      return null;
   }

   const sanitized = slug.trim();

   // Slug should only contain alphanumeric, hyphens, and underscores
   if (!/^[a-z0-9_-]+$/i.test(sanitized)) {
      return null;
   }

   // Prevent slugs longer than 200 characters
   if (sanitized.length > 200) {
      return null;
   }

   return sanitized;
}

/**
 * GET /api/events/[slug]
 * Retrieves event details by slug
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing slug
 * @returns JSON response with event data or error message
 */
export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse>> {
   try {
      // Await the params to get the slug
      let { slug } = await params;
      
      // Decode URL-encoded slug
      slug = decodeURIComponent(slug);
      
      console.log('API received slug:', slug, 'Type:', typeof slug, 'Length:', slug?.length);

      // Validate and sanitize slug
      const validatedSlug = validateSlug(slug);

      if (!validatedSlug) {
         console.log('Slug validation failed for:', slug);
         return NextResponse.json(
            {
               success: false,
               error: `Invalid slug parameter: "${slug}". Slug must contain only alphanumeric characters, hyphens, and underscores.`,
            } as ErrorResponse,
            { status: 400 }
         );
      }
      
      console.log('Validated slug:', validatedSlug);

      // Connect to database
      await connectDB();

      // Query event by slug (case-insensitive)
      const event = await Event.findOne(
         { slug: validatedSlug.toLowerCase() },
         // Project all fields
         null,
         // Query options
         { lean: true }
      ).exec();

      // Event not found
      if (!event) {
         return NextResponse.json(
            {
               success: false,
               error: `Event with slug "${validatedSlug}" not found.`,
            } as ErrorResponse,
            { status: 404 }
         );
      }

      // Return successful response with event data
      return NextResponse.json(
         {
            success: true,
            data: event as IEvent,
         } as SuccessResponse,
         { status: 200 }
      );
   } catch (error) {
      // Handle database connection errors
      if (error instanceof Error) {
         if (error.message.includes('MONGODB_URI')) {
            return NextResponse.json(
               {
                  success: false,
                  error: 'Database connection failed. Please try again later.',
               } as ErrorResponse,
               { status: 503 }
            );
         }

         // Log unexpected errors for debugging
         console.error('Error fetching event by slug:', error);
      }

      // Generic server error response
      return NextResponse.json(
         {
            success: false,
            error: 'Internal server error. Please try again later.',
         } as ErrorResponse,
         { status: 500 }
      );
   }
}

/**
 * Handles unsupported HTTP methods
 */
export async function POST(): Promise<NextResponse<ErrorResponse>> {
   return NextResponse.json(
      {
         success: false,
         error: 'Method not allowed. Use GET to fetch event details.',
      },
      { status: 405 }
   );
}

export async function PUT(): Promise<NextResponse<ErrorResponse>> {
   return NextResponse.json(
      {
         success: false,
         error: 'Method not allowed. Use GET to fetch event details.',
      },
      { status: 405 }
   );
}

export async function DELETE(): Promise<NextResponse<ErrorResponse>> {
   return NextResponse.json(
      {
         success: false,
         error: 'Method not allowed. Use GET to fetch event details.',
      },
      { status: 405 }
   );
}
