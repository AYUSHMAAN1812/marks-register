// app/api/update-record/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/db.js'; 
import Record from '../../models/Record.js'; 
import mongoose from 'mongoose';

export async function PUT(request) {
    try {
        await connectDB();
        
        const data = await request.json(); 
        const { _id, ...updateData } = data; // Destructure the unique ID and the rest of the data

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json({ message: 'Invalid or missing record ID' }, { status: 400 });
        }

        // Use findByIdAndUpdate to locate and modify the document
        const updatedRecord = await Record.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true } // {new: true} returns the updated document; {runValidators: true} enforces schema rules
        );

        if (!updatedRecord) {
            return NextResponse.json({ message: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Record updated successfully', 
            record: updatedRecord
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating record:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ message: 'Validation Error', details: error.message }, { status: 400 });
        }
        return NextResponse.json({ 
            message: 'Internal Server Error during update', 
            error: error.message
        }, { status: 500 });
    }
}