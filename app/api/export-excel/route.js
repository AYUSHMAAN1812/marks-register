// app/api/export-excel/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/db.js'; 
import Record from '../../models/Record.js'; 
import * as XLSX from 'xlsx'; // Import the xlsx library

export async function GET() {
    try {
        await connectDB();
        
        // 1. Fetch data from MongoDB
        const records = await Record.find({}).lean();

        // 2. Sort the data by roll_number in ascending order
        const sortedRecords = records.sort((a, b) => {
            // Convert to number for reliable sorting, assuming roll_number is numeric
            const rollA = parseInt(a.roll_number, 10) || 0;
            const rollB = parseInt(b.roll_number, 10) || 0;
            return rollA - rollB;
        });

        // 3. Define the desired column order and capitalised headers
        const exportHeaders = [
            'ROLL NUMBER', 
            'ADMISSION NUMBER', 
            'STUDENT NAME', 
            'ENGLISH', 
            'HINDI', 
            'ODIA', 
            'MATHEMATICS', 
            'SCIENCE', 
            'SOCIAL SCIENCE'
        ];

        // Map the MongoDB field keys to the desired output order
        const exportKeys = [
            'roll_number', 
            'admin_number', 
            'student_name', 
            'english', 
            'hindi', 
            'odia', 
            'mathematics', 
            'science', 
            'social_science'
        ];
        
        // 4. Transform data for the Excel sheet
        const sheetData = sortedRecords.map(record => {
            let row = {};
            exportKeys.forEach((key, index) => {
                row[exportHeaders[index]] = record[key];
            });
            return row;
        });

        // 5. Create the Excel workbook and sheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sheetData, { header: exportHeaders });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Marks');

        // 6. Convert the workbook to a Buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        
        // 7. Prepare response headers
        const filename = 'Student_Marks_Export.xlsx';

        // Convert the Buffer to an ArrayBuffer for Next.js Response
        const arrayBuffer = excelBuffer.buffer.slice(excelBuffer.byteOffset, excelBuffer.byteOffset + excelBuffer.byteLength);

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Length': arrayBuffer.byteLength,
            },
        });

    } catch (error) {
        console.error('Error exporting Excel file:', error);
        return NextResponse.json({ message: 'Error exporting data', error: error.message }, { status: 500 });
    }
}