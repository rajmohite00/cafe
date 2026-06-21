'use client';

import { useEffect } from 'react';

/**
 * DesignSync — fetches the admin-saved accent color and applies it
 * as a CSS variable on the document root so the whole site updates.
 * Runs once on mount (client-side only).
 */
export default function DesignSync() {
  useEffect(() => {
    const sync = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/data/settings/design`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data?.value?.color) {
          document.documentElement.style.setProperty('--amber',      data.data.value.color);
          document.documentElement.style.setProperty('--amber-dark', data.data.value.color);
        }
      } catch { /* silent — use CSS default */ }
    };
    sync();
  }, []);

  return null;
}
