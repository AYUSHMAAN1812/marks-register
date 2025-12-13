"use client"
import { useState } from "react";
// 🚨 Correction 1: Use 'next/navigation' for App Router
import { useRouter, useSearchParams } from "next/navigation"; 
const Dashboard = () => {
    // Initialize useRouter from 'next/navigation'
    const router = useRouter(); 
    const searchParams = useSearchParams();
    
    // Extract context data (this part is crucial for combining data on submit)
    const contextData = {
        teacher_name: searchParams.get('teacher_name') || '',
        standard: searchParams.get('standard') || '',
        section: searchParams.get('section') || '',
        title: searchParams.get('title') || '',
        max_marks: searchParams.get('max_marks') || '',
    };
    
    const [form, setForm] = useState({
        student_name: "",
        roll_number: "",
        admin_number: "", 
        english: "",
        hindi: "",
        odia: "",
        mathematics: "",
        science: "",
        social_science: "",
    });

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const dataToSubmit = {
            ...contextData,
            ...form,
        };
        
        try {
            const response = await fetch('/api/save-json', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });
            
            if (response.ok) {
                console.log("Data added to MongoDB successfully.");
                // Reset form fields after successful submission
                setForm({
                    student_name: "", roll_number: "", admin_number: "", english: "", 
                    hindi: "", odia: "", mathematics: "", science: "", social_science: "",
                });
                
            } else {
                const errorData = await response.json(); 
                console.log("Failed to save the data:", errorData.message);
            }
        } catch (error) {
            console.error("Error while saving the data: ", error);
        }
    };
    
    // Function to handle navigation to the data-view page
    const handleDataViewClick = () => {
        router.push("/data-view");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                
                {/* Header and Navigation Button */}
                <header className="flex justify-between items-center pb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-indigo-900">
                        Student Marks Entry
                    </h1>
                    <button 
                        onClick={handleDataViewClick} 
                        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Go to Data View
                    </button>
                </header>

                <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Student and Admin/Roll Number Fields */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Student Identity</h3>
                            </div>
                            
                            <div>
                                <label htmlFor="student_name" className="block text-sm font-medium text-gray-700">Student Name:</label>
                                <input id="student_name" name="student_name" value={form.student_name} required placeholder="e.g. John Doe" onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="admin_number" className="block text-sm font-medium text-gray-700">Admin Number:</label>
                                <input id="admin_number" name="admin_number" value={form.admin_number} required placeholder="e.g. 12345" onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="roll_number" className="block text-sm font-medium text-gray-700">Roll Number:</label>
                                <input id="roll_number" name="roll_number" value={form.roll_number} required placeholder="e.g. 34" onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                             <div className="col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Subject Marks (Max Marks: {contextData.max_marks || 'N/A'})</h3>
                            </div>
                            
                            {/* Subject Marks Inputs (use a dynamic loop or list them) */}
                            {['english', 'hindi', 'odia', 'mathematics', 'science', 'social_science'].map(subject => (
                                <div key={subject}>
                                    <label htmlFor={subject} className="block text-sm font-medium text-gray-700 capitalize">{subject.replace('_', ' ')}:</label>
                                    <input 
                                        id={subject} 
                                        name={subject} 
                                        value={form[subject]} 
                                        required 
                                        type="number"
                                        min="0"
                                        max={contextData.max_marks || undefined}
                                        placeholder="e.g. 20" 
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {/* Submission Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                            >
                                Submit Record
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;