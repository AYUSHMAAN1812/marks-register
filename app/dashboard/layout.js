// app/dashboard/layout.js
import { Suspense } from 'react';

// 1. The layout component must accept the 'children' prop.
// 2. Do NOT import './page.js' directly.

export default function DashboardLayout({ children }) {
  return (
    <>
      {/* 3. Wrap the {children} prop in the Suspense boundary. */}
      <Suspense fallback={<p>Loading dashboard...</p>}>
        {children} 
      </Suspense>
    </>
  );
}