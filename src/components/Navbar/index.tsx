'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Our Menu',     href: '#menu'         },
  { label: 'Chef\'s Story', href: '#about'        },
  { label: 'Testimonials', href: '#testimonials'  },
  { label: 'About',        href: '#sustainability' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        
        {/* Logo */}
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <ellipse cx="14" cy="18" rx="10" ry="7" fill="#E8941A" opacity="0.15"/>
              <path d="M7 14 Q14 7 21 14" stroke="#E8941A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M5 14 Q14 6 23 14 L22 22 Q14 28 6 22 Z" fill="none" stroke="#2C1506" strokeWidth="1.5"/>
              <path d="M22 14 Q26 14 26 18 Q26 22 22 22" stroke="#2C1506" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <ellipse cx="14" cy="13" rx="5" ry="3" fill="#E8941A" opacity="0.3"/>
            </svg>
          </span>
          <span className={styles.logoText}>Raj&apos;s Cafe</span>
        </a>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search"><Search size={18} strokeWidth={1.8}/></button>
          <button className={styles.iconBtn} aria-label="Cart"><ShoppingBag size={18} strokeWidth={1.8}/></button>
          <a href="#reservation" className={styles.bookBtn}>Book a Table</a>
          <button className={styles.mobileMenu} aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className={styles.drawer}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className={styles.drawerLink} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#reservation" className="btn-primary" onClick={() => setOpen(false)}>Book a Table</a>
        </div>
      )}
    </header>
  );
}
