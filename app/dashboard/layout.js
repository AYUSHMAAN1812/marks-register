// app/dashboard/layout.js
import { Suspense } from 'react';
import Dashboard from './page.js';
// This is a Server Component layout wrapper for the Dashboard page
export default function DashboardLayout() {
  return (
    // Wrap the content (which is app/dashboard/page.js) in Suspense
    // This resolves the useSearchParams error during Vercel build time.
    <>
      <Suspense fallback={<p>Loading feed...</p>}>
        <Dashboard />
      </Suspense>
    </>
  );
}