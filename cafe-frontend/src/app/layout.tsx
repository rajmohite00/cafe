import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import RevealObserver from '@/components/RevealObserver';
import ActivityTracker from '@/components/ActivityTracker';

export const metadata: Metadata = {
  title: "Raj's Cafe — The Perfect Blend of Aroma & Ambiance",
  description: "Experience artisan coffee, gourmet Indian food, and warm hospitality at Raj's Cafe, New Delhi. Award-winning café since 2010.",
  keywords: "Raj's Cafe, artisan coffee, café New Delhi, specialty coffee, gourmet breakfast, Indian cafe",
  openGraph: {
    title: "Raj's Cafe",
    description: "The Perfect Blend of Aroma & Ambiance",
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CartProvider>
          {children}
          <RevealObserver />
          <ActivityTracker />
        </CartProvider>
      </body>
    </html>
  );
}

