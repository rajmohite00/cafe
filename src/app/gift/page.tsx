'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './gift.module.css';

const PRESET_AMOUNTS = [200, 500, 1000, 2000, 5000];

export default function GiftPage() {
  const [selected, setSelected]     = useState<number | 'custom'>(1000);
  const [customAmt, setCustomAmt]   = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMsg, setRedeemMsg]   = useState<string | null>(null);
  const [sent, setSent]             = useState(false);

  // Effective amount shown everywhere
  const effectiveAmt =
    selected === 'custom'
      ? Number(customAmt) || 0
      : selected;

  const displayAmt = effectiveAmt > 0
    ? `₹${effectiveAmt.toLocaleString('en-IN')}`
    : '₹—';

  // Also update the mock card live
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmt <= 0) return;
    setSent(true);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    // Simulate a balance check
    setRedeemMsg(
      redeemCode.toUpperCase() === 'RAJSCAFE100'
        ? '✅ Valid! Balance: ₹1,000 — Applied to your account.'
        : '❌ Code not found. Please check and try again.'
    );
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* ── HERO ── */}
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={`container ${styles.heroContent}`}>
            <span className="section-label">Perfect Gift</span>
            <h1 className={styles.heroTitle}>
              Gift the Joy of<br /><em>Great Coffee</em>
            </h1>
            <p className={styles.heroSub}>
              Whether it&apos;s a birthday, anniversary, or just because — a Raj&apos;s Cafe gift card is always the right choice.
            </p>
          </div>

          {/* Live-updating card mockup */}
          <div className={styles.cardMockup}>
            <div className={styles.mockCard}>
              <div className={styles.mockCardTop}>
                <span className={styles.mockLogo}>☕ Raj&apos;s Cafe</span>
                <span className={styles.mockTag}>Gift Card</span>
              </div>
              {/* Amount updates as user selects */}
              <div className={styles.mockAmount}>{displayAmt}</div>
              <div className={styles.mockBottom}>
                <span>Valid for 12 months</span>
                <span>●●●● 4821</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>

            {/* ── LEFT — FORM ── */}
            <div className={styles.formSection}>
              <h2 className={styles.formTitle}>Send a Gift Card</h2>

              {!sent ? (
                <>
                  {/* Amount picker */}
                  <div className={styles.amountGrid}>
                    {PRESET_AMOUNTS.map(a => (
                      <button
                        key={a}
                        className={`${styles.amountBtn} ${selected === a ? styles.amountActive : ''}`}
                        onClick={() => { setSelected(a); setCustomAmt(''); }}
                        type="button"
                      >
                        ₹{a.toLocaleString('en-IN')}
                      </button>
                    ))}
                    <button
                      className={`${styles.amountBtn} ${selected === 'custom' ? styles.amountActive : ''}`}
                      onClick={() => setSelected('custom')}
                      type="button"
                    >
                      Custom →
                    </button>
                  </div>

                  {/* Custom amount input — shown only when "Custom" selected */}
                  {selected === 'custom' && (
                    <div className={styles.customWrap}>
                      <span className={styles.customPrefix}>₹</span>
                      <input
                        type="number"
                        placeholder="Enter amount (min ₹100)"
                        className={`form-input ${styles.customInput}`}
                        value={customAmt}
                        min={100}
                        max={50000}
                        onChange={e => setCustomAmt(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Selected amount preview badge */}
                  <div className={styles.amountPreview}>
                    Selected: <strong>{displayAmt}</strong>
                  </div>

                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Recipient Name</label>
                      <input className="form-input" type="text" placeholder="Their name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Recipient Email</label>
                      <input className="form-input" type="email" placeholder="their@email.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input className="form-input" type="text" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Personal Message (optional)</label>
                      <textarea className="form-textarea" rows={3} placeholder="Write a warm message..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Send Date</label>
                      <input className="form-input" type="date" required />
                    </div>
                    <button
                      type="submit"
                      className={`btn-primary ${styles.sendBtn}`}
                      disabled={effectiveAmt <= 0}
                    >
                      🎁 Send Gift Card — {displayAmt}
                    </button>
                  </form>
                </>
              ) : (
                /* ── SUCCESS STATE ── */
                <div className={styles.successState}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3 className={styles.successTitle}>Gift Card Sent!</h3>
                  <p className={styles.successMsg}>
                    Your {displayAmt} gift card is on its way. The recipient will receive it in their inbox within a few minutes.
                  </p>
                  <button
                    className="btn-outline"
                    onClick={() => { setSent(false); setSelected(1000); }}
                  >
                    Send Another Gift Card
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT — INFO ── */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Why Raj&apos;s Cafe Gift Cards?</h3>
                <div className={styles.infoList}>
                  {[
                    { icon: '📧', title: 'Instant Digital Delivery',    desc: 'Delivered via email within minutes — perfect for last-minute gifting.' },
                    { icon: '📅', title: 'Schedule Ahead',               desc: 'Pick a future date — ideal for birthdays and anniversaries.' },
                    { icon: '♾️', title: 'Use Anywhere on Menu',         desc: 'Redeemable on all food, drinks, and merchandise — no restrictions.' },
                    { icon: '🔒', title: 'Secure & Non-Expiring Balance', desc: 'Valid for 12 months, unused balance never goes to waste.' },
                  ].map(i => (
                    <div key={i.title} className={styles.infoItem}>
                      <span className={styles.infoIcon}>{i.icon}</span>
                      <div>
                        <div className={styles.infoItemTitle}>{i.title}</div>
                        <div className={styles.infoItemDesc}>{i.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redeem section */}
              <div className={styles.redeemCard}>
                <h3 className={styles.redeemTitle}>Have a Gift Card?</h3>
                <p className={styles.redeemSub}>Enter your code to check balance or apply to your next order.</p>
                <form className={styles.redeemRow} onSubmit={handleRedeem}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="XXXXX-XXXXX-XXXXX"
                    style={{ flex: 1 }}
                    value={redeemCode}
                    onChange={e => setRedeemCode(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Check →
                  </button>
                </form>
                {redeemMsg && (
                  <p className={styles.redeemResult}>{redeemMsg}</p>
                )}
                <p className={styles.redeemHint}>Try demo code: <code>RAJSCAFE100</code></p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
