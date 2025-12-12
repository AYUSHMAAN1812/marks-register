// lib/db.js (Corrected for Serverless Caching)
import mongoose from "mongoose";
// import { ENV } from "./env.js";

const { MONGO_URI } = process.env.MONGO_URI;

// 1. Define a global cache object to store the connection promise
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 2. Return cached connection if available
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }
  
  // 3. If a connection promise is running, wait for it
  if (!cached.promise) {
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");
    
    // Set bufferCommands to false for serverless environments
    const opts = { bufferCommands: false };

    cached.promise = mongoose.connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log("New MongoDB connection established.");
        return mongoose;
      })
      .catch(error => {
        // Clear promise on failure to allow retrying
        cached.promise = null; 
        console.error("Error while connecting MongoDB: ", error);
        // Do NOT use process.exit(1) in Next.js Route Handlers. Throwing the error is better.
        throw error; 
      });
  }

  // 4. Wait for the connection promise to resolve
  cached.conn = await cached.promise;
  return cached.conn;
};