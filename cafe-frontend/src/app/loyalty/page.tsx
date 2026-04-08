'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './loyalty.module.css';

const tiers = [
  { name: 'Brew Starter',    points: '0–499',   color: '#8A7560', icon: '🌱', perks: ['1 point per ₹10 spent', 'Birthday treat', 'Member-only offers'] },
  { name: 'Coffee Lover',    points: '500–1,999', color: '#C97A10', icon: '☕', perks: ['All Starter perks', 'Free drink at 500 pts', '2x points weekends', 'Early menu access'] },
  { name: 'Gold Member',     points: '2,000–4,999', color: '#D4AF37', icon: '🥇', perks: ['All Lover perks', 'Monthly free drink', 'Exclusive events', 'Free delivery on orders'] },
  { name: 'Raj\'s Reserve',  points: '5,000+',  color: '#E8941A', icon: '👑', perks: ['All Gold perks', 'Chef\'s table access', 'Yearly anniversary gift', 'Priority booking forever'] },
];

const faqs = [
  { q: 'How do I earn points?', a: 'You earn 1 point for every ₹10 spent at Raj\'s Cafe — whether dine-in, takeaway, or online orders.' },
  { q: 'Do points expire?', a: 'Points are valid for 12 months from your last transaction. Stay active and they never expire!' },
  { q: 'Can I gift my points?', a: 'Yes! Gold and Reserve members can transfer up to 500 points per month to friends and family.' },
  { q: 'How do I redeem a free drink?', a: 'When you hit 500 points, you\'ll get a notification. Show the QR code in our app or website to redeem.' },
];

export default function LoyaltyPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <>
      <Navbar light />
      <main className={styles.main}>

        {/* ── HERO ── */}
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.heroBadge}>★ Raj&apos;s Rewards</span>
            <h1 className={styles.heroTitle}>Sip More,<br /><em>Earn More</em></h1>
            <p className={styles.heroSub}>
              Join 10,000+ members already earning free coffees, exclusive access, 
              and surprise treats — just by doing what you love.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}><span className={styles.statNum}>10K+</span><span className={styles.statLabel}>Members</span></div>
              <div className={styles.statDiv} />
              <div className={styles.stat}><span className={styles.statNum}>₹0</span><span className={styles.statLabel}>To Join</span></div>
              <div className={styles.statDiv} />
              <div className={styles.stat}><span className={styles.statNum}>500</span><span className={styles.statLabel}>Points = Free Drink</span></div>
            </div>
            <a href="#join" className={styles.heroBtn}>Join Free Now →</a>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className={styles.howSection} id="how-it-works">
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center', display: 'block' }}>How It Works</p>
            <h2 className={`section-title ${styles.howTitle}`}>Three Simple Steps</h2>

            <div className={styles.steps}>
              {[
                { icon: '📝', title: 'Sign Up Free', desc: 'Create your account below in 30 seconds. No credit card, no fees — ever.' },
                { icon: '☕', title: 'Earn Every Visit', desc: 'Spend ₹10, earn 1 point. Every order, dine-in or takeaway, counts.' },
                { icon: '🎁', title: 'Redeem Rewards', desc: 'Hit 500 points? Get a free drink. Hit 2,000? Unlock Gold and exclusive perks.' },
              ].map((s, i) => (
                <div
                  key={s.title}
                  className={`${styles.step} ${activeStep === i ? styles.stepActive : ''}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className={styles.stepNum}>{i + 1}</div>
                  <div className={styles.stepIcon}>{s.icon}</div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Connector line */}
            <div className={styles.connectorRow} aria-hidden="true">
              <div className={styles.connector} />
            </div>
          </div>
        </section>

        {/* ── TIERS ── */}
        <section className={styles.tiersSection}>
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center', display: 'block' }}>Membership Tiers</p>
            <h2 className={`section-title ${styles.tiersTitle}`}>The Higher You Go, The Better It Gets</h2>

            <div className={styles.tiersGrid}>
              {tiers.map((t, i) => (
                <div key={t.name} className={`${styles.tierCard} ${i === 2 ? styles.tierCardFeatured : ''}`}
                  style={{ '--tier-color': t.color } as React.CSSProperties}>
                  {i === 2 && <div className={styles.tierPopular}>Most Popular</div>}
                  <div className={styles.tierIcon}>{t.icon}</div>
                  <h3 className={styles.tierName}>{t.name}</h3>
                  <div className={styles.tierPoints}>{t.points} pts</div>
                  <ul className={styles.tierPerks}>
                    {t.perks.map(p => (
                      <li key={p} className={styles.tierPerk}>
                        <span className={styles.tierCheck}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOIN FORM ── */}
        <section className={styles.joinSection} id="join">
          <div className="container">
            <div className={styles.joinCard}>
              {!joined ? (
                <>
                  <div className={styles.joinLeft}>
                    <span className={styles.joinBadge}>Free Forever</span>
                    <h2 className={styles.joinTitle}>Join Raj&apos;s Rewards Today</h2>
                    <p className={styles.joinSub}>
                      Start earning instantly. Enter your email and we&apos;ll send your welcome pack — including <strong>100 bonus points</strong> to kick things off.
                    </p>
                    <form className={styles.joinForm} onSubmit={handleJoin}>
                      <div className={styles.joinRow}>
                        <input type="text" placeholder="Your name" className="form-input" required />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="form-input"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className={`btn-primary ${styles.joinBtn}`} id="loyalty-signup-submit">
                        🎉 Join Free & Get 100 Bonus Points
                      </button>
                      <p className={styles.joinNote}>No credit card required · Unsubscribe anytime</p>
                    </form>
                  </div>
                  <div className={styles.joinRight} aria-hidden="true">
                    <div className={styles.mockCard}>
                      <div className={styles.mcTop}>
                        <span>☕ Raj&apos;s Cafe</span>
                        <span className={styles.mcTier}>Gold Member</span>
                      </div>
                      <div className={styles.mcName}>Your Name</div>
                      <div className={styles.mcPoints}>
                        <span className={styles.mcNum}>100</span>
                        <span className={styles.mcLabel}>BONUS POINTS</span>
                      </div>
                      <div className={styles.mcBar}><div className={styles.mcBarFill} style={{ width: '20%' }} /></div>
                      <div className={styles.mcNext}>400 pts to first free drink ☕</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.successState}>
                  <div className={styles.successEmoji}>🎉</div>
                  <h2 className={styles.successTitle}>Welcome to Raj&apos;s Rewards!</h2>
                  <p className={styles.successSub}>
                    Check <strong>{email}</strong> for your welcome pack with 100 bonus points. 
                    Start earning on your next visit!
                  </p>
                  <Link href="/menu" className="btn-primary">Explore Our Menu →</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className={styles.faqSection}>
          <div className="container">
            <h2 className={`section-title ${styles.faqTitle}`}>Common Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((f, i) => (
                <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                  <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <span className={styles.faqArrow}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <div className={styles.faqA}>{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
