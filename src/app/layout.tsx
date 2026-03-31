import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raj's Cafe — Luxury Dining Experience",
  description:
    "Experience the finest cafe dining at Raj's Cafe. Artisanal coffee, gourmet cuisine, and an unforgettable atmosphere. Book your table today.",
  keywords: ["Raj's Cafe", "luxury cafe", "fine dining", "artisan coffee", "gourmet food", "restaurant"],
  openGraph: {
    title: "Raj's Cafe — Luxury Dining Experience",
    description: "Experience the finest cafe dining. Artisanal coffee, gourmet cuisine, unforgettable atmosphere.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
