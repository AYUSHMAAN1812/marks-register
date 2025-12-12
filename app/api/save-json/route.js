// app/api/save-json/route.js (MongoDB / Mongoose version)

import { NextResponse } from 'next/server';
import {connectDB} from '../../lib/db.js'; // Adjust path as necessary
import Record from '../../models/Record.js'; // Adjust path as necessary

export async function POST(request) {
  try {
    // 1. Connect to the database
    await connectDB();
    
    // 2. Parse the incoming JSON data (which contains both metadata and student marks)
    const data = await request.json(); 

    // 3. Create a new document in the MongoDB collection
    // The model schema automatically ensures the data structure
    const newRecord = await Record.create(data); 

    // 4. Return success response
    return NextResponse.json({ 
        message: 'Data saved successfully to MongoDB', 
        id: newRecord._id 
    }, { status: 201 }); // 201 Created is typical for a successful POST
    
  } catch (error) {
    console.error('Error in POST /api/save-json:', error);

    // 5. Return an error response
    // Mongoose validation errors often result in a 400 Bad Request
    if (error.name === 'ValidationError') {
        return NextResponse.json({ message: 'Validation Error', details: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
        message: 'Internal Server Error saving data', 
        error: error.message
    }, { status: 500 });
  }
}

// Optional: Add a GET method to fetch the data for testing
export async function GET() {
    try {
        await connectDB();
        const records = await Record.find({});
        return NextResponse.json(records, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching records' }, { status: 500 });
    }
}