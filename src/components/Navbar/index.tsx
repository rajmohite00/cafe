'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '#about',        label: 'About'        },
  { href: '#menu',         label: 'Menu'          },
  { href: '#chef',         label: 'Chef'          },
  { href: '#testimonials', label: 'Reviews'       },
  { href: '#location',     label: 'Location'      },
  { href: '#faq',          label: 'FAQ'           },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id); });
      },
      { threshold: 0.3 }
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={close}>
          <span className={styles.logoAccent}>✦</span>
          <span className={styles.logoText}>Raj<em>&apos;s</em> Cafe</span>
        </Link>

        {/* Desktop links */}
        <nav className={styles.links} aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`${styles.link} ${active === href ? styles.linkActive : ''}`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#reservation" className={`btn-primary ${styles.navCta}`}>
          Book a Table
        </a>

        {/* Mobile toggle */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <nav className={styles.drawerLinks}>
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className={styles.drawerLink} onClick={close}>
              {label}
            </a>
          ))}
          <a href="#reservation" className={`btn-primary ${styles.drawerCta}`} onClick={close}>
            Book a Table
          </a>
        </nav>
      </div>
    </header>
  );
}
