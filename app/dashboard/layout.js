// app/dashboard/layout.js
import { Suspense } from 'react';

// This is a Server Component layout wrapper for the Dashboard page
export default function DashboardLayout({ children }) {
  return (
    // Wrap the content (which is app/dashboard/page.js) in Suspense
    // This resolves the useSearchParams error during Vercel build time.
    <Suspense fallback={<div>Loading dashboard...</div>}>
      {children}
    </Suspense>
  );
}