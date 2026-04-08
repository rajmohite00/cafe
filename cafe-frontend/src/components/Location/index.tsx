import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';
import styles from './Location.module.css';

const hours = [
  { day: 'Monday – Friday', time: '8:00 AM – 10:00 PM' },
  { day: 'Saturday',         time: '7:00 AM – 11:00 PM' },
  { day: 'Sunday',           time: '7:00 AM – 11:00 PM' },
  { day: 'Public Holidays',  time: '8:00 AM – 8:00 PM'  },
];

export default function Location() {
  return (
    <section id="location" className={`section-pad ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Find Us</span>
          <h2 className="section-title">Visit <em>Raj&apos;s Cafe</em></h2>
        </div>

        <div className={styles.grid}>
          {/* Info cards */}
          <div className={styles.infoCol}>
            {/* Address */}
            <div className={`${styles.infoCard} glass-card`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}><MapPin size={18} strokeWidth={1.5} /></div>
                <h3 className={styles.cardTitle}>Address</h3>
              </div>
              <p className={styles.cardBody}>
                12-A, Connaught Place<br />
                Block E, New Delhi, 110001<br />
                India
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Get Directions <ExternalLink size={13} />
              </a>
            </div>

            {/* Hours */}
            <div className={`${styles.infoCard} glass-card`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}><Clock size={18} strokeWidth={1.5} /></div>
                <h3 className={styles.cardTitle}>Opening Hours</h3>
              </div>
              <div className={styles.hoursGrid}>
                {hours.map(h => (
                  <div key={h.day} className={styles.hourRow}>
                    <span className={styles.hourDay}>{h.day}</span>
                    <span className={styles.hourTime}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className={`${styles.infoCard} glass-card`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}><Phone size={18} strokeWidth={1.5} /></div>
                <h3 className={styles.cardTitle}>Contact</h3>
              </div>
              <div className={styles.contactList}>
                <a href="tel:+911123456789" className={styles.contactItem}>
                  <Phone size={14} /> +91 11 2345 6789
                </a>
                <a href="mailto:hello@rajscafe.in" className={styles.contactItem}>
                  <Mail size={14} /> hello@rajscafe.in
                </a>
              </div>
            </div>
          </div>

          {/* Map embed */}
          <div className={styles.mapCol}>
            <div className={styles.mapWrap}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9042069455017!2d77.21882731508376!3d28.631565882417226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Raj's Cafe Location Map"
              />
              <div className={styles.mapOverlay} />
              <div className={styles.mapPin}>
                <div className={styles.mapPinDot}>📍</div>
                <div className={styles.mapPinLabel}>Raj&apos;s Cafe</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
