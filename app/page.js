// app/page.js
"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

const Home = () => {
  const router = useRouter(); 
  
  const [form, setForm] = useState({
    teacher_name: "",
    standard: "",
    section: "",
    title: "",
    max_marks: "",
  });

  // Navigation Logic remains the same
  useEffect(() => {
    const allFieldsFilled = 
      form.teacher_name && form.standard && form.section && 
      form.title && form.max_marks;

    if (allFieldsFilled) {
      const params = new URLSearchParams(form).toString();
      router.push(`/dashboard?${params}`);
    }
  }, [form, router]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic handled by useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-indigo-900 mb-6 text-center">
          Class Details
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Enter the defining details for this batch's mark list.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(form).map((key) => (
            <div key={key}>
              <label 
                htmlFor={key} 
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {key.replace('_', ' ')}:
              </label>
              <input 
                id={key} 
                name={key} 
                type={key === 'max_marks' ? 'number' : 'text'}
                value={form[key]} 
                required 
                placeholder={`e.g. ${key === 'standard' ? 'IV' : key === 'max_marks' ? '20' : key === 'section' ? 'E' : key === 'title'? 'PERIODIC ASSESSMENT - I (2025-26)' : 'John Doe'}`} 
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}

          <button 
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          >
            Go to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;