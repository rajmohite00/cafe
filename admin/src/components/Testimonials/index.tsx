'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import styles from './Testimonials.module.css';

const MokaPotSVG = () => (
  <svg viewBox="0 0 160 220" fill="none" className={styles.mokaPot}>
    <path d="M50 120 L40 200 Q40 210 80 210 Q120 210 120 200 L110 120 Z" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <ellipse cx="80" cy="120" rx="30" ry="10" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <path d="M55 120 L65 60 Q68 45 80 45 Q92 45 95 60 L105 120" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <ellipse cx="80" cy="60" rx="25" ry="15" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <path d="M80 45 L80 20" stroke="#8A7560" strokeWidth="2" strokeLinecap="round"/>
    <path d="M70 25 Q80 10 90 25" stroke="#8A7560" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M120 140 Q140 135 142 148 Q144 162 120 165" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <path d="M40 140 Q20 135 18 148 Q16 162 40 165" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
  </svg>
);

const reviews = [
  { name: 'Priya M.',  handle: '@priya_brews', emoji: '👩', rating: 5,
    text: 'Best coffee in town! The atmosphere is cozy and the baristas genuinely care. Highly recommend the iced latte — it\'s perfect every single time.' },
  { name: 'James L.',  handle: '@james_coffee', emoji: '👨', rating: 5,
    text: 'Love this place for a quick break. Fast service, incredible pastries, and the chai is absolutely on point. My daily mid-afternoon ritual now.' },
  { name: 'Ananya S.', handle: '@ananya_s',    emoji: '🧕', rating: 5,
    text: 'Raj\'s Cafe is my go-to for catching up with friends. The vibe is relaxed, the music is right, and the coffee is always on point. A true gem!' },
  { name: 'Rohan V.',  handle: '@rohan_v',     emoji: '🧔', rating: 5,
    text: 'Impressed with the quality. The single-origin coffee program is fantastic — you can tell they really care about where the beans are from.' },
  { name: 'Sophie L.', handle: '@sophie_paris', emoji: '👱', rating: 5,
    text: 'Visiting from Paris and this café blew me away. The Saffron Latte is unlike anything I\'ve tried. Warm, elegant, and utterly unforgettable.' },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const maxIdx = reviews.length - visible;
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(maxIdx, i + 1));
  const shown = reviews.slice(idx, idx + visible);

  return (
    <>
      {/* Top wave */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="var(--cream-dark)"/>
        </svg>
      </div>

      <section id="testimonials" className={`section-pad ${styles.section}`}>
        <MokaPotSVG />

        <div className="container">
          <div className={styles.header}>
            <p className="section-label reveal" style={{ display: 'block' }}>Guest Reviews</p>
            <h2 className={`section-title ${styles.title} reveal delay-1`}>
              What Our Guests Have to Say
            </h2>
            <p className="section-subtitle reveal delay-2" style={{ textAlign: 'center', marginInline: 'auto', marginTop: '0.75rem' }}>
              Genuine reviews from guests who experienced the perfect blend of
              culture, coffee, and community at Raj&apos;s Cafe.
            </p>
            <a href="#" className={`${styles.feedbackBtn} reveal delay-3`}>Share Your Feedback</a>
          </div>

          {/* Cards */}
          <div className={styles.cardsRow}>
            {shown.map((r, i) => (
              <div key={r.name + idx} className={`${styles.card} reveal delay-${i + 1}`}>
                <Quote size={26} className={styles.quoteIcon} strokeWidth={1.5} />

                {/* Stars */}
                <div className={styles.stars}>
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>

                <div className={styles.reviewer}>
                  <div className={styles.avatar}>{r.emoji}</div>
                  <div>
                    <div className={styles.reviewerName}>{r.name}</div>
                    <div className={styles.reviewerHandle}>{r.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className={styles.navRow}>
            <button
              className={`${styles.navBtn} ${idx === 0 ? styles.navBtnDisabled : ''}`}
              onClick={prev} aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`${styles.navBtn} ${styles.navBtnActive} ${idx >= maxIdx ? styles.navBtnDisabled : ''}`}
              onClick={next} aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom wave */}
      <div className={styles.waveBottom} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1380,60 1440,40 L1440,80 L0,80 Z" fill="var(--cream)"/>
        </svg>
      </div>
    </>
  );
}
