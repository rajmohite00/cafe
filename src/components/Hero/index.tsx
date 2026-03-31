'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

/* ── Inline SVG illustrations ── */
const CoffeeBeanSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="20" rx="28" ry="18" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <path d="M30 4 Q40 12 40 20 Q40 28 30 36" stroke="#8A7560" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M30 4 Q20 12 20 20 Q20 28 30 36" stroke="#8A7560" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const LeafSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 110 C10 80 5 50 20 20 C30 5 50 5 60 20 C75 50 70 80 40 110Z" stroke="#9E7550" strokeWidth="1.5" fill="none"/>
    <path d="M40 110 L40 15" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M40 40 Q55 35 62 28" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M40 55 Q55 50 65 44" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M40 70 Q54 66 62 60" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M40 40 Q25 35 18 28" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M40 55 Q25 50 15 44" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M40 70 Q26 66 18 60" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);

const SmallBeanSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 28" fill="none">
    <ellipse cx="20" cy="14" rx="18" ry="12" stroke="#9E7550" strokeWidth="1.5" fill="none"/>
    <path d="M20 3 Q26 8 26 14 Q26 20 20 25" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M20 3 Q14 8 14 14 Q14 20 20 25" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

const CupSketchSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 140" fill="none">
    <path d="M20 40 L30 120 Q35 130 60 130 Q85 130 90 120 L100 40 Z" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <ellipse cx="60" cy="40" rx="40" ry="12" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <path d="M100 55 Q118 55 118 70 Q118 85 100 85" stroke="#8A7560" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="60" cy="40" rx="28" ry="8" stroke="#8A7560" strokeWidth="1" fill="none" opacity="0.5"/>
    <path d="M45 18 Q50 5 55 18" stroke="#8A7560" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M58 14 Q63 2 68 14" stroke="#8A7560" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export default function Hero() {
  const heroRef   = useRef<HTMLElement>(null);
  const bgRef     = useRef<HTMLDivElement>(null);
  const illus1Ref = useRef<HTMLDivElement>(null); // top-left leaves
  const illus2Ref = useRef<HTMLDivElement>(null); // bottom-left beans
  const illus3Ref = useRef<HTMLDivElement>(null); // right side beans
  const imgRef    = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const heroH = heroRef.current?.offsetHeight ?? window.innerHeight;
        const p = Math.min(y / heroH, 1);

        // Background subtle drift
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${y * 0.4}px)`;
        }
        // Illustration clusters drift at different speeds
        if (illus1Ref.current) {
          illus1Ref.current.style.transform = `translateY(${y * -0.15}px) rotate(${y * 0.02}deg)`;
        }
        if (illus2Ref.current) {
          illus2Ref.current.style.transform = `translateY(${y * -0.22}px) rotate(${y * -0.01}deg)`;
        }
        if (illus3Ref.current) {
          illus3Ref.current.style.transform = `translateY(${y * -0.18}px) rotate(${y * 0.015}deg)`;
        }
        // Image frame
        if (imgRef.current) {
          imgRef.current.style.transform = `translateY(${y * 0.12}px)`;
          imgRef.current.style.opacity   = String(1 - p * 1.2);
        }
        // Text
        if (textRef.current) {
          textRef.current.style.transform = `translateY(${y * 0.08}px)`;
          textRef.current.style.opacity   = String(Math.max(0, 1 - p * 1.8));
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className={styles.hero}>

      {/* ── Parallax: background cream gradient ── */}
      <div ref={bgRef} className={styles.bgLayer} aria-hidden="true">
        <div className={styles.bgWave1} />
        <div className={styles.bgWave2} />
        <div className={styles.bgSpot1} />
        <div className={styles.bgSpot2} />
      </div>

      {/* ── Parallax: Top-left illustration cluster ── */}
      <div ref={illus1Ref} className={styles.illustrationGroup1} aria-hidden="true">
        <LeafSVG className={`${styles.illus} ${styles.leaf1}`} />
        <LeafSVG className={`${styles.illus} ${styles.leaf2}`} />
        <SmallBeanSVG className={`${styles.illus} ${styles.bean1}`} />
      </div>

      {/* ── Parallax: Bottom-left illustration cluster ── */}
      <div ref={illus2Ref} className={styles.illustrationGroup2} aria-hidden="true">
        <CoffeeBeanSVG className={`${styles.illus} ${styles.bean2}`} />
        <SmallBeanSVG className={`${styles.illus} ${styles.bean3}`} />
        <LeafSVG className={`${styles.illus} ${styles.leaf3}`} />
      </div>

      {/* ── Parallax: Right-side floating illustrations ── */}
      <div ref={illus3Ref} className={styles.illustrationGroup3} aria-hidden="true">
        <CoffeeBeanSVG className={`${styles.illus} ${styles.bean4}`} />
        <LeafSVG className={`${styles.illus} ${styles.leaf4}`} />
        <SmallBeanSVG className={`${styles.illus} ${styles.bean5}`} />
        <CupSketchSVG className={`${styles.illus} ${styles.cupSketch}`} />
      </div>

      {/* ── Main content ── */}
      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div className={styles.grid}>

          {/* Left — Text */}
          <div ref={textRef} className={styles.textCol}>

            {/* Social proof pill */}
            <div className={styles.proofPill}>
              <div className={styles.avatarStack}>
                {['👨','👩','🧔','🧕','👱'].map((e, i) => (
                  <div key={i} className={styles.avatar} style={{ zIndex: 5-i, marginLeft: i === 0 ? 0 : '-10px' }}>{e}</div>
                ))}
              </div>
              <div>
                <div className={styles.proofCount}>10,000+</div>
                <div className={styles.proofLabel}>Happy Customers</div>
              </div>
            </div>

            {/* Headline */}
            <h1 className={styles.headline}>
              The Perfect Blend of<br />
              <em>Aroma</em> &amp; <em>Ambiance</em>
            </h1>

            {/* Subtext */}
            <p className={styles.subtext}>
              We&apos;re committed to ethical sourcing and sustainable practices for a
              better coffee experience.
            </p>

            {/* CTAs */}
            <div className={styles.ctas}>
              <a href="#menu" className={styles.ctaBtn}>
                Explore Our Specials
                <CoffeeBeanSVG className={styles.ctaBeanIcon} />
              </a>
              <a href="#reservation" className={styles.ctaLink}>
                Book a Table →
              </a>
            </div>
          </div>

          {/* Right — Image */}
          <div ref={imgRef} className={styles.imgCol}>
            <div className={styles.imgFrame}>
              <div className={styles.imgBorder}>
                <Image
                  src="/cafe-hero.png"
                  alt="A beautiful latte art coffee with a golden croissant at Raj's Cafe"
                  fill
                  priority
                  sizes="(max-width: 900px) 90vw, 50vw"
                  className={styles.heroImg}
                />
              </div>
              {/* Corner brackets */}
              <div className={styles.cornerTL} />
              <div className={styles.cornerTR} />
              <div className={styles.cornerBL} />
              <div className={styles.cornerBR} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Wave divider bottom ── */}
      <div className={styles.waveDivider} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="#E8D9BB"/>
        </svg>
      </div>
    </section>
  );
}
