'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if we have a pathname
    if (!pathname) return;

    // Track the visit
    const trackVisit = async () => {
      try {
        await fetch('http://localhost:5000/api/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'visit',
            description: `A user visited: ${pathname}`
          })
        });
      } catch (err) {
        console.error('Failed to log activity', err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // pure logic component, renders nothing
}
