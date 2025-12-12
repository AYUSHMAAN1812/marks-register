// app/api/data-view/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/db.js';
import Record from '../../models/Record.js';

export async function GET() {
    try {
        await connectDB();

        // 1. Fetch all records from the MongoDB 'records' collection
        const records = await Record.find({}).lean(); // .lean() converts Mongoose documents to plain JavaScript objects

        // 2. Filter and shape the data to only include the required fields for the table
        const tabularData = records.map(record => ({
            _id: record._id,
            teacher_name: record.teacher_name,
            standard: record.standard,
            section: record.section,
            title: record.title,
            max_marks: record.max_marks,
            roll_number: record.roll_number,
            admin_number: record.admin_number,
            student_name: record.student_name,
            english: record.english,
            hindi: record.hindi,
            odia: record.odia,
            mathematics: record.mathematics,
            science: record.science,
            social_science: record.social_science,
        }));

        return NextResponse.json(tabularData, { status: 200 });

    } catch (error) {
        console.error('Error fetching records for data view:', error);
        return NextResponse.json({
            message: 'Error fetching data',
            error: error.message
        }, { status: 500 });
    }
}