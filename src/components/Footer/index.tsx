import { Share2, MessageCircle, Rss, Globe, Heart } from 'lucide-react';
import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';

const links = {
  'Quick Links':   ['About Us','Our Menu','Chef\'s Story','Private Dining','Blog'],
  'Reservations':  ['Book a Table','Group Bookings','Corporate Events','Gift Cards','Catering'],
  'Legal':         ['Privacy Policy','Terms of Service','Accessibility','Cookie Policy'],
};

const socials = [
  { icon: MessageCircle, href: '#', label: 'Instagram' },
  { icon: Share2,        href: '#', label: 'Facebook'  },
  { icon: Globe,         href: '#', label: 'Twitter'   },
  { icon: Rss,           href: '#', label: 'YouTube'   },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top CTA strip */}
      <div className={styles.ctaStrip}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h3 className={styles.ctaTitle}>Ready for an unforgettable meal?</h3>
              <p className={styles.ctaText}>Tables available 7 days a week. Book yours today.</p>
            </div>
            <a href="#reservation" className="btn-primary">
              Reserve a Table
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand col */}
            <div className={styles.brandCol}>
              <div className={styles.logo}>
                <span className={styles.logoAccent}>✦</span>
                <span className={styles.logoText}>Raj<em>&apos;s</em> Cafe</span>
              </div>
              <p className={styles.tagline}>
                Where every sip tells a story. Crafted with passion, served with grace — 
                since 2010 in the heart of New Delhi.
              </p>
              <div className={styles.socials}>
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} className={styles.socialLink} aria-label={label}>
                    <Icon size={16} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links cols */}
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className={styles.linkCol}>
                <h4 className={styles.linkTitle}>{title}</h4>
                <ul>
                  {items.map(item => (
                    <li key={item}>
                      <a href="#" className={styles.linkItem}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div className={styles.newsletterCol}>
              <h4 className={styles.linkTitle}>Stay in the loop</h4>
              <p className={styles.newsletterText}>
                Get seasonal menus, exclusive events, and special offers delivered to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copy}>
              &copy; {new Date().getFullYear()} Raj&apos;s Cafe. All rights reserved.
            </p>
            <p className={styles.made}>
              Made with <Heart size={12} fill="currentColor" /> in New Delhi
            </p>
            <a href="/admin" className={styles.adminLink}>
              Admin Panel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
