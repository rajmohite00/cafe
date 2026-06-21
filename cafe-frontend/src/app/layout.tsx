import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import RevealObserver from '@/components/RevealObserver';
import ActivityTracker from '@/components/ActivityTracker';
import DesignSync from '@/components/DesignSync';
import ErrorBoundary from '@/components/ErrorBoundary';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultMetadata: Metadata = {
  title:       "Raj's Cafe — The Perfect Blend of Aroma & Ambiance",
  description: "Experience artisan coffee, gourmet Indian food, and warm hospitality at Raj's Cafe, New Delhi. Award-winning café since 2010.",
  keywords:    "Raj's Cafe, artisan coffee, café New Delhi, specialty coffee, gourmet breakfast, Indian cafe",
  openGraph: {
    title:       "Raj's Cafe",
    description: "The Perfect Blend of Aroma & Ambiance",
    type:        'website',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    if (!API_URL) return defaultMetadata;
    const res = await fetch(`${API_URL}/api/data/settings/seo`, {
      next: { revalidate: 300 }, // refresh every 5 min
    });
    const data = await res.json();
    if (data.success && data.data?.value) {
      const seo = data.data.value;
      return {
        title:       seo.title       || defaultMetadata.title,
        description: seo.description || defaultMetadata.description,
        keywords:    seo.keywords    || defaultMetadata.keywords,
        openGraph: {
          title:       seo.title       || "Raj's Cafe",
          description: seo.description || "The Perfect Blend of Aroma & Ambiance",
          images:      seo.ogImage ? [seo.ogImage] : [],
          type:        'website',
        },
        other: seo.verification ? { 'google-site-verification': seo.verification } : {},
      };
    }
  } catch { /* fall through to default */ }
  return defaultMetadata;
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              {children}
              <RevealObserver />
              <ActivityTracker />
              <DesignSync />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
