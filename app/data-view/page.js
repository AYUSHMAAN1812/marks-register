"use client";
import { useState, useEffect } from 'react';

const DataViewPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null); // State to hold the _id of the record being edited
    const [editedData, setEditedData] = useState({}); // State to hold temporary input changes
    const handleExportExcel = async () => {
        try {
            const response = await fetch('../api/export-excel', {
                method: 'GET', // Use GET since we are just requesting data
            });

            if (!response.ok) {
                throw new Error(`Failed to generate Excel file: ${response.statusText}`);
            }

            // 1. Get the file buffer (Blob) from the response
            const blob = await response.blob();
            
            // 2. Get the filename from the Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'Student_Marks_Export.xlsx';

            // 3. Create a temporary URL and trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            console.log(`Successfully downloaded: ${filename}`);

        } catch (error) {
            console.error("Excel export failed:", error);
            alert(`Error generating Excel file: ${error.message}`);
        }
    };
    const handlePrint = async (record) => {
        try {
            const dataToSend = {
                teacher_name: record.teacher_name,
                standard: record.standard,
                section: record.section,
                title: record.title,
                max_marks: record.max_marks,

                student_name: record.student_name, // Must match the name used in POST destructuring
                english: record.english,
                hindi: record.hindi,
                odia: record.odia,
                mathematics: record.mathematics,
                science: record.science,
                social_science: record.social_science,
            };

            const response = await fetch('../api/print-marksheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate document: ${response.statusText}`);
            }

            // 1. Get the file buffer from the response
            const blob = await response.blob();

            // 2. Extract the filename from the Content-Disposition header (optional, but robust)
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
            const filename = filenameMatch ? filenameMatch[1] : `Marksheet_${record.student_name}.docx`;

            // 3. Create a temporary URL and trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            console.log(`Successfully downloaded: ${filename}`);

        } catch (error) {
            console.error("Print failed:", error);
            alert(`Error generating document: ${error.message}`);
        }
    };
    // Columns for the table header (including the MongoDB _id key)
    const columns = [
        { key: '_id', label: 'ID', hide: true }, // Hidden but required for PUT request
        { key: 'roll_number', label: 'Roll Number' },
        { key: 'admin_number', label: 'Admission Number' },
        { key: 'student_name', label: 'Student Name' },
        { key: 'english', label: 'English' },
        { key: 'hindi', label: 'Hindi' },
        { key: 'odia', label: 'Odia' },
        { key: 'mathematics', label: 'Mathematics' },
        { key: 'science', label: 'Science' },
        { key: 'social_science', label: 'Social Science' },
    ];

    // Function to fetch data (refactored for reuse)
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('../api/data-view');
            if (!response.ok) {
                throw new Error('Failed to fetch data from API');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchData();
    }, []);

    // Handlers for editing
    const handleEdit = (record) => {
        setEditingId(record._id);
        setEditedData(record); // Load the current record data into the temporary state
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedData({});
    };

    const handleInputChange = (e, key) => {
        // Update the temporary edited data state
        setEditedData({
            ...editedData,
            [key]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch('../api/update-record', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedData), // Send the entire edited object including _id
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save changes.');
            }

            // After successful save, refresh the entire data set
            await fetchData();
            setEditingId(null);
            setEditedData({});
            console.log("Record updated successfully!");

        } catch (err) {
            console.error("Save failed:", err);
            alert(`Error saving record: ${err.message}`);
        }
    };

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (data.length === 0) return <div>No student records found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-6"> {/* 💡 MODIFIED HEADER */}
                <div>
                    <h2 className="text-3xl font-extrabold text-indigo-900">
                        Student Data Records
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Review, edit, and export marks stored in the database.
                    </p>
                </div>
                
                {/* 💡 NEW EXPORT BUTTON */}
                <button 
                    onClick={handleExportExcel} 
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Export to Excel (.xlsx)
                </button>
            </header>

            <div className="shadow-xl overflow-hidden rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                        <tr>
                            {columns.filter(col => !col.hide).map(col => (
                                <th 
                                    key={col.key} 
                                    className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-center text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row) => {
                            const isEditing = editingId === row._id;
                            const rowClasses = isEditing ? 'bg-yellow-50 transition duration-200' : 'hover:bg-gray-50';

                            return (
                                <tr key={row._id} className={rowClasses}>
                                    {columns.filter(col => !col.hide).map(col => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {isEditing ? (
                                                <input
                                                    type={['english', 'hindi', 'odia', 'mathematics', 'science', 'social_science'].includes(col.key) ? 'number' : 'text'}
                                                    value={editedData[col.key] || ''}
                                                    onChange={(e) => handleInputChange(e, col.key)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            ) : (
                                                row[col.key]
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleSave} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md transition duration-150">Save</button>
                                                <button onClick={handleCancel} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition duration-150">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleEdit(row)} 
                                                    className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md transition duration-150"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handlePrint(row)} 
                                                    className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-md transition duration-150"
                                                >
                                                    Print
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Simple inline styles
const tableStyle = { borderCollapse: 'collapse', width: '100%', marginTop: '20px', border: '1px solid #ddd' };
const tableHeaderStyle = { border: '1px solid #ddd', padding: '10px', textAlign: 'left', fontWeight: 'bold' };
const tableCellStyle = { border: '1px solid #ddd', padding: '8px' };

export default DataViewPage;