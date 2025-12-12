// lib/env.js (Simplified for Next.js)

// Remove the import and call to dotenv.config()

export const ENV = {
  // Next.js automatically loads these from .env.local
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
};