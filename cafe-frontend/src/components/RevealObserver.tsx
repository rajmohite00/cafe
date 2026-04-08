'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait two frames so Next.js scroll-restoration finishes
    // before we check which elements are in the viewport.
    let raf1: number, raf2: number;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const els = document.querySelectorAll<HTMLElement>(
          '.reveal, .reveal-left, .reveal-right'
        );

        // Reset any stale .revealed classes (e.g. navigating back to same page)
        els.forEach((el) => el.classList.remove('revealed'));

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.08,
            // Generous rootMargin: fires earlier so nothing is missed
            rootMargin: '0px 0px -40px 0px',
          }
        );

        els.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  // Re-run every time the route changes (covers back-navigation)
  }, [pathname]);

  return null;
}
