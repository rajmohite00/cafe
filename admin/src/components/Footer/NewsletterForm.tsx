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
      <button type="submit" className={styles.newsletterBtn}>
        Subscribe
      </button>
    </form>
  );
}
