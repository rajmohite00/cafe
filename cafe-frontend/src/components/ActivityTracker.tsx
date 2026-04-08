'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const trackVisit = async () => {
      try {
        await fetch(`${API_URL}/api/activities`, {
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
