import type { Metadata } from 'next';
import '../../app/globals.css';
import styles from './admin.module.css';

export const metadata: Metadata = {
  title: "Admin Panel — Raj's Cafe",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminRoot}>
      {children}
    </div>
  );
}
