'use client';

import styles from './Footer.module.css';

export default function NewsletterForm() {
  return (
    <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className={styles.newsletterInput}
        required
        aria-label="Email for newsletter"
      />
      <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.78rem' }}>
        Subscribe
      </button>
    </form>
  );
}
