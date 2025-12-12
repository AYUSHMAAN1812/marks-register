// app/api/print-marksheet/route.js
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from "docx";
import { NextResponse } from 'next/server';

// ------------------ WORD GENERATION FUNCTION (Moved from client) ------------------
async function generateWordDocument(teacherName, standard, section, title, maxMarks, student, eng_m, hin_m, od_m, math_m, sc_m, ssc_m) {
    const finalName = String(student).toUpperCase();

    // Build tableData using index-based extracted subjects
    const tableData = [
        ["SUBJECT", "MARKS OBTAINED"],
        ["ENGLISH", String(eng_m)],
        ["HINDI", String(hin_m)],
        ["ODIA", String(od_m)],
        ["MATHEMATICS", String(math_m)],
        ["SCIENCE", String(sc_m)],
        ["SOCIAL SCIENCE", String(ssc_m)],
    ];

    const tableRows = tableData.map((row, index) => {
        const isHeader = index === 0;

        return new TableRow({
            children: row.map(text =>
                new TableCell({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: String(text),
                                    bold: isHeader,
                                    size: 28,
                                    font: "Times New Roman",
                                }),
                            ],
                        }),
                    ],
                    width: { size: 5000, type: WidthType.DXA },
                })
            ),
        });
    });

    // ---------- SIGNATURE BLOCK (using your provided structure) ----------
    const signatureTable = new Table({
        // ... (Your signature table definition, exactly as provided)
        width: { size: 10000, type: WidthType.DXA },
        borders: {
            top: { style: "none" },
            bottom: { style: "none" },
            left: { style: "none" },
            right: { style: "none" },
            insideHorizontal: { style: "none" },
            insideVertical: { style: "none" }
        },
        rows: [
             new TableRow({
                children: [
                    new TableCell({
                        borders: {},
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [new TextRun({ text: "Ms. "+teacherName, bold: false, size: 28 })],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [new TextRun({ text: "Class Teacher", size: 24 })],
                            }),
                        ],
                    }),
                    new TableCell({
                        borders: {},
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [new TextRun({ text: "Mrs. Dharashree Padhi", bold: false, size: 28 })],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [new TextRun({ text: "Principal", size: 24 })],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    // ---------- DOCUMENT (using your provided structure) ----------
    const doc = new Document({
        sections: [
            {
                children: [
                    // ... (All your Paragraphs and TextRuns for the header and name)
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "DAV PUBLIC SCHOOL, BERHAMPUR, ODISHA", size: 32, bold: true, font: "Times New Roman" }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: title, size: 32, font: "Times New Roman" }),
                        ],
                    }),
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "MARK LIST", size: 32, font: "Times New Roman", bold: true }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 150 },
                        children: [
                            new TextRun({ text: `NAME: ${finalName}`, size: 28, font: "Times New Roman" }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 150 },
                        children: [
                            new TextRun({ text: `Std. ${standard} ${section}`, size: 28, font: "Times New Roman" }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: `MAX MARKS PER SUBJECT: ${maxMarks}`, size: 28, font: "Times New Roman" }),
                        ],
                    }),

                    // The Marks Table
                    new Table({
                        width: { size: 5000, type: WidthType.DXA },
                        rows: tableRows,
                        alignment: AlignmentType.CENTER,
                    }),

                    new Paragraph({ text: "", spacing: { before: 500 } }),
                    
                    // The Signature Table
                    signatureTable,
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `Marksheet_${finalName}.docx`;
    
    // Return the buffer and filename
    return { buffer, filename };
}


// ------------------ ROUTE HANDLER ------------------
export async function POST(request) {
    try {
        const { 
            teacher_name, standard, section, title, max_marks, 
            student_name, english, hindi, odia, mathematics, science, social_science 
        } = await request.json();

        const { buffer, filename } = await generateWordDocument(
            // Pass the destructured variables to the generation function
            teacher_name, standard, section, title, max_marks, 
            student_name, english, hindi, odia, mathematics, science, social_science
        );

        // Convert the buffer to an array buffer for the Next.js Response
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

        // Return the file buffer with appropriate headers for download
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Length': arrayBuffer.byteLength,
            },
        });

    } catch (error) {
        console.error('Error generating document:', error);
        return NextResponse.json({ message: 'Error generating document', error: error.message }, { status: 500 });
    }
}