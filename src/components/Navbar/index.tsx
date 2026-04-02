'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Our Menu',      href: '/#menu'         },
  { label: "Chef's Story",  href: '/#about'        },
  { label: 'Testimonials',  href: '/#testimonials' },
  { label: 'Reservations',  href: '/#reservation'  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { totalItems }          = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
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
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={styles.navLink}>{l.label}</Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search"><Search size={18} strokeWidth={1.8}/></button>

          {/* Cart icon with badge */}
          <Link href="/cart" className={styles.cartBtn} aria-label={`Cart (${totalItems} items)`}>
            <ShoppingBag size={18} strokeWidth={1.8}/>
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems > 9 ? '9+' : totalItems}</span>
            )}
          </Link>

          <Link href="/#reservation" className={styles.bookBtn}>Book a Table</Link>

          <button className={styles.mobileMenu} aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className={styles.drawer}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={styles.drawerLink} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/cart" className={styles.drawerLink} onClick={() => setOpen(false)}>
            🛒 Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          <Link href="/#reservation" className="btn-primary" onClick={() => setOpen(false)}>Book a Table</Link>
        </div>
      )}
    </header>
  );
}
