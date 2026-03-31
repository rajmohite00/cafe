'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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
  { name: 'Priya M.', handle: '@priya', emoji: '👩',
    text: '"Best coffee in town! The atmosphere is cozy and the baristas are super friendly. Highly recommend the iced latte!"' },
  { name: 'James L.', handle: '@james',  emoji: '👨',
    text: '"Love this place for a quick coffee break. The service is fast and efficient, and the pastries are delicious. Perfect for a mid-afternoon pick-me-up."' },
  { name: 'Ananya S.', handle: '@ananya', emoji: '🧕',
    text: '"Raj\'s Cafe is my go-to spot for catching up with friends. The vibe is relaxed and the coffee is always on point. Great local spot!"' },
  { name: 'Rohan V.',  handle: '@rohan',  emoji: '🧔',
    text: '"Impressed with the quality here. The single-origin coffee program is fantastic — you can tell they really care about where the beans come from."' },
  { name: 'Sophie L.', handle: '@sophie', emoji: '👱',
    text: '"Visiting from Paris and this café completely blew me away. The Saffron Latte is unlike anything I\'ve tried before. Will definitely return!"' },
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
            <h2 className={`section-title ${styles.title}`}>What Our Guests Have to Say</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', marginInline: 'auto', marginTop: '0.75rem' }}>
              Read genuine reviews from our satisfied guests and see how our exceptional coffee,
              delicious food, and welcoming atmosphere have made their experiences memorable.
            </p>
            <a href="#" className={styles.feedbackBtn}>Share Your Feedback</a>
          </div>

          {/* Cards */}
          <div className={styles.cardsRow}>
            {shown.map((r, i) => (
              <div key={r.name + idx} className={styles.card}>
                <Quote size={28} className={styles.quoteIcon} strokeWidth={1.5} />
                <p className={styles.reviewText}>{r.text}</p>
                <div className={styles.reviewer}>
                  <div className={styles.avatar}>{r.emoji}</div>
                  <div>
                    <div className={styles.reviewerName}>{r.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className={styles.navRow}>
            <button className={`${styles.navBtn} ${idx === 0 ? styles.navBtnDisabled : ''}`} onClick={prev} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button className={`${styles.navBtn} ${styles.navBtnActive} ${idx >= maxIdx ? styles.navBtnDisabled : ''}`} onClick={next} aria-label="Next">
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
