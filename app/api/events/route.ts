import {NextResponse, NextRequest} from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req : NextRequest) {
   try {
      await connectDB();

      const formData = await req.formData();
      const event: Record<string, unknown> = {};

      for (const [key, value] of formData.entries()) {

         // Handle array fields (agenda, tags)
         if (key === 'agenda' || key === 'tags') {
            if (!event[key]) {
               event[key] = [];
            }
            (event[key] as string[]).push(value as string);
         } else {
            event[key] = value;
         }
      }

      const imgfile = formData.get('image') as File;

      if(!imgfile) return NextResponse.json({message: "Image file is required"}, {status: 400});

      const tags = JSON.parse(formData.get('tags') as string);
      const agenda = JSON.parse(formData.get('agenda') as string);


      const arrayBuffer = await imgfile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
         cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
            if(error) return reject(error);
            resolve(results);
         }).end(buffer);
      });

      event.image = (uploadResult as {secure_url: string }).secure_url;




      const createdEvent = await Event.create({
         ...event,
         tags: tags,
         agenda: agenda,
      });
      return NextResponse.json({message: "Event Created Successfully", event: createdEvent}, {status: 201});

   } catch (error) {
      console.error("Error fetching events:", error);
      console.error("Error creating event:", error);
            
      // Return validation errors to client, but hide internal errors
      const isValidationError = error instanceof Error && 
         (error.name === 'ValidationError' || error.message.includes('cannot be empty'));
      
      return NextResponse.json({
         message: "Event Creation Failed",
         error: isValidationError ? error.message : "An unexpected error occurred"
      }, { 
         status: isValidationError ? 400 : 500 }
      );   
   }
}

export async function GET() {
   try{
      await connectDB();

      const events = await Event.find().sort({ createdAt: -1});

      return NextResponse.json({message: 'Events fetched successfully', events}, {status: 200});
   } catch (e) {
      console.error('Error fetching events:', e);
      return NextResponse.json({message: 'Event fetching failed'}, {status: 500});
   }}
