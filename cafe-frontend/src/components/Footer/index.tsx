'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Share2, MessageCircle, Rss, Globe, Heart } from 'lucide-react';
import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';

const links = {
  'Explore': [
    { label: 'Our Menu',        href: '/#menu'        },
    { label: "Chef's Story",    href: '/#about'       },
    { label: 'Blog',            href: '/blog'         },
    { label: 'Coffee Quiz',     href: '/quiz'         },
    { label: 'Loyalty Rewards', href: '/loyalty'      },
  ],
  'Services': [
    { label: 'Book a Table',     href: '/#reservation' },
    { label: 'Gift Cards',       href: '/gift'         },
    { label: 'Group Bookings',   href: '/#reservation' },
    { label: 'Corporate Events', href: '/#reservation' },
    { label: 'Catering',         href: '/#reservation' },
  ],
};

const socials = [
  { icon: MessageCircle, href: '#', label: 'Instagram' },
  { icon: Share2,        href: '#', label: 'Facebook'  },
  { icon: Globe,         href: '#', label: 'Twitter'   },
  { icon: Rss,           href: '#', label: 'YouTube'   },
];

const LeafDecor = () => (
  <svg viewBox="0 0 80 120" fill="none" className={styles.leafDecor}>
    <path d="M40 110 C10 80 5 50 20 20 C30 5 50 5 60 20 C75 50 70 80 40 110Z" stroke="#9E7550" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M40 110 L40 15" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M40 40 Q55 35 62 28" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
    <path d="M40 60 Q54 56 62 50" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

// ── Fetch opening hours from admin backend ────────────────────────────────
type HourEntry = { day: string; open: string; close: string; closed: boolean };

// Converts "08:00" → "8AM"
function fmt(t: string) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m > 0 ? `${hour}:${String(m).padStart(2,'0')}${suffix}` : `${hour}${suffix}`;
}

export default function Footer() {
  const [hours, setHours] = useState<HourEntry[] | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) return;
    fetch(`${API_URL}/api/data/settings/hours`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data?.value)) {
          setHours(data.data.value);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Top CTA strip */}
      <div className={styles.ctaStrip}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h3 className={styles.ctaTitle}>Book A Table</h3>
              <p className={styles.ctaText}>Reserve your spot today and experience the perfect blend of aroma &amp; ambiance.</p>
            </div>
            <LeafDecor />
            <a href="#reservation" className={styles.ctaBtn}>Reserve Now →</a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brandCol}>
              <div className={styles.logo}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M5 14 Q14 6 23 14 L22 22 Q14 28 6 22 Z" fill="none" stroke="var(--amber)" strokeWidth="1.5"/>
                  <path d="M22 14 Q26 14 26 18 Q26 22 22 22" stroke="var(--amber)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
                <span className={styles.logoText}>Raj&apos;s Cafe</span>
              </div>
              <p className={styles.tagline}>
                The perfect blend of aroma &amp; ambiance. Serving artisan coffee and gourmet food since 2010.
              </p>
              <div className={styles.socials}>
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} className={styles.socialLink} aria-label={label}>
                    <Icon size={16} strokeWidth={1.8}/>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className={styles.linkCol}>
                <h4 className={styles.linkTitle}>{title}</h4>
                <ul>
                  {items.map(item => (
                    <li key={item.label}>
                      <a href={item.href} className={styles.linkItem}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact — with dynamic hours */}
            <div className={styles.linkCol}>
              <h4 className={styles.linkTitle}>Contact</h4>
              <div className={styles.contactList}>
                <div className={styles.contactItem}><MapPin size={14}/> 12-A Connaught Place, New Delhi</div>

                {/* Dynamic opening hours from admin */}
                {hours ? (
                  hours.filter(h => !h.closed).slice(0, 2).map(h => (
                    <div key={h.day} className={styles.contactItem}>
                      <Clock size={14}/> {h.day}: {fmt(h.open)}–{fmt(h.close)}
                    </div>
                  ))
                ) : (
                  <div className={styles.contactItem}><Clock size={14}/> Mon–Sun: 8AM–10PM</div>
                )}

                <a href="tel:+911123456789" className={styles.contactItem}><Phone size={14}/> +91 11 2345 6789</a>
                <a href="mailto:hello@rajscafe.in" className={styles.contactItem}><Mail size={14}/> hello@rajscafe.in</a>
              </div>
            </div>

            {/* Newsletter */}
            <div className={styles.newsletterCol}>
              <h4 className={styles.linkTitle}>Stay in the loop</h4>
              <p className={styles.newsletterText}>Get seasonal menus and special offers.</p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copy}>&copy; {new Date().getFullYear()} Raj&apos;s Cafe. All rights reserved.</p>
            <p className={styles.made}>Made with <Heart size={11} fill="currentColor" /> in New Delhi</p>
            <a href="/admin" className={styles.adminLink}>Admin Panel</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
