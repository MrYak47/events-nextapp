import mongoose, { Connection } from 'mongoose';
import dns from 'dns';

// Type definition for the global cache to store the mongoose connection

dns.setServers(["1.1.1.1", "8.8.8.8"]);

interface MongooseCache {
   conn: Connection | null;
   promise: Promise<Connection> | null;
}

// Declare global type for Node.js to store cached connection
declare global {
   var mongooseCache: MongooseCache | undefined;
}

// Initialize global cache if not already done
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
   global.mongooseCache = cached;
}

/**
 * Connects to MongoDB using Mongoose
 * Implements connection caching to prevent multiple connections during development
 * 
 * @returns Promise<Connection> - The Mongoose connection object
 * @throws Error if MONGODB_URI environment variable is not defined
 */
export async function connectDB(): Promise<Connection> {
  // Return cached connection if already connected
   if (cached.conn && cached.conn.readyState === 1) {
      return cached.conn;
   }
   if (cached.conn && cached.conn.readyState !== 1) {
      cached.conn = null;
   }

  // If connection promise is pending, wait for it to resolve
   if (cached.promise) {
      return cached.promise;
   }

  // Get MongoDB URI from environment variables
   const mongoUri = process.env.MONGODB_URI;
   
   if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
   }

  // Create connection promise
   cached.promise = mongoose
      .connect(mongoUri, {
      // Connection options for better stability and performance
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => {
      // Cache the connection
      cached.conn = mongoose.connection;
      return mongoose.connection;
      })
      .catch((error) => {
      // Clear promise on error to allow retry
      cached.promise = null;
      throw error;
      });

      return cached.promise;
}

/**
 * Disconnects from MongoDB
 * Useful for testing or graceful shutdown
 * 
 * @returns Promise<void>
 */
export async function disconnectDB(): Promise<void> {
   try {
      await cached.promise;
   } catch {
      // ignore: connection attempt already failed
   }

   if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
   }

   cached.conn = null;
   cached.promise = null;
}

/**
 * Gets the current Mongoose connection
 * 
 * @returns Connection | null - The current connection or null if not connected
 */
export function getConnection(): Connection | null {
   return cached.conn;
}

/**
 * Checks if MongoDB is currently connected
 * 
 * @returns boolean - True if connected, false otherwise
 */
export function isConnected(): boolean {
   return cached.conn !== null && cached.conn.readyState === 1;
}

export default connectDB;
