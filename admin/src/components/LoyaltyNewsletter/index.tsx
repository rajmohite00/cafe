'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './LoyaltyNewsletter.module.css';

export default function LoyaltyNewsletter() {
  const [email, setEmail]       = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <>
      {/* ── LOYALTY STRIP ── */}
      <section className={styles.loyalty} id="loyalty">
        <div className={`container ${styles.loyaltyInner}`}>

          <div className={styles.loyaltyLeft}>
            <span className={styles.loyaltyBadge}>★ Raj&apos;s Rewards</span>
            <h2 className={styles.loyaltyTitle}>
              Earn Points With<br />
              <em className={styles.loyaltyAccent}>Every Sip</em>
            </h2>
            <p className={styles.loyaltySub}>
              Join 10,000+ members earning free coffees, exclusive early access,
              and birthday treats — all with a single tap.
            </p>
            <div className={styles.loyaltyPerks}>
              {[
                { icon: '☕', label: '1 Point per ₹10 spent'  },
                { icon: '🎁', label: 'Free drink at 500 points' },
                { icon: '🎂', label: 'Birthday double points'  },
                { icon: '🥇', label: 'Gold tier at 2000 points' },
              ].map(p => (
                <div key={p.label} className={styles.perk}>
                  <span className={styles.perkIcon}>{p.icon}</span>
                  <span className={styles.perkLabel}>{p.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.loyaltyCtas}>
              {/* ✅ Both buttons now navigate to the loyalty page */}
              <Link href="/loyalty" className="btn-primary" id="loyalty-join">
                Join Free →
              </Link>
              <Link href="/loyalty#how-it-works" className={styles.learnMore}>
                Learn how it works
              </Link>
            </div>
          </div>

          <div className={styles.loyaltyRight} aria-hidden="true">
            <div className={styles.loyaltyCard}>
              <div className={styles.lcTop}>
                <span className={styles.lcLogo}>☕ Raj&apos;s Cafe</span>
                <span className={styles.lcTier}>Gold Member</span>
              </div>
              <div className={styles.lcPoints}>
                <span className={styles.lcPtsNum}>1,840</span>
                <span className={styles.lcPtsLabel}>REWARD POINTS</span>
              </div>
              <div className={styles.lcBar}>
                <div className={styles.lcBarFill} style={{ width: '92%' }} />
              </div>
              <div className={styles.lcNext}>160 pts to next free drink ☕</div>
              <div className={styles.lcName}>Priya Sharma · Member since 2024</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className={styles.newsletter} id="newsletter">
        <div className={`container ${styles.nlInner}`}>
          <div className={styles.nlContent}>

            {!subscribed ? (
              <>
                <span className={styles.nlBadge}>📮 Newsletter</span>
                <h2 className={styles.nlTitle}>Get Weekly Coffee Inspiration</h2>
                <p className={styles.nlSub}>
                  Brewing tips, seasonal menus, special offers &amp; recipes — straight to your inbox.
                  <br />No spam. Unsubscribe anytime.
                </p>
                <form className={styles.nlForm} onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={styles.nlInput}
                    id="newsletter-email"
                    aria-label="Email for newsletter"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className={styles.nlBtn} id="newsletter-submit">
                    Subscribe Free →
                  </button>
                </form>
                <p className={styles.nlNote}>
                  🎁 Get our <strong>Secret Masala Chai Recipe PDF</strong> as a welcome gift!
                </p>
              </>
            ) : (
              /* ✅ Success state after subscribing */
              <div className={styles.nlSuccess}>
                <span className={styles.nlSuccessIcon}>🎉</span>
                <h3 className={styles.nlSuccessTitle}>You&apos;re In!</h3>
                <p className={styles.nlSuccessMsg}>
                  Check <strong>{email}</strong> for your welcome email + the Secret Masala Chai Recipe PDF.
                  <br />We can&apos;t wait to share our best coffee stories with you!
                </p>
                <button className={styles.nlResetBtn} onClick={() => { setSubscribed(false); setEmail(''); }}>
                  Subscribe another email
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
