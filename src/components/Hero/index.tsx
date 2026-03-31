'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Calendar, ArrowDown, Star } from 'lucide-react';
import styles from './Hero.module.css';

// Particle data (fixed so no hydration mismatch)
const PARTICLES = [
  { x: 10, y: 20, size: 3, speed: 0.04, delay: 0    },
  { x: 25, y: 60, size: 2, speed: 0.07, delay: 0.5  },
  { x: 40, y: 35, size: 4, speed: 0.05, delay: 1    },
  { x: 60, y: 75, size: 2, speed: 0.09, delay: 0.2  },
  { x: 75, y: 15, size: 3, speed: 0.06, delay: 0.8  },
  { x: 85, y: 45, size: 2, speed: 0.08, delay: 0.3  },
  { x: 15, y: 80, size: 5, speed: 0.03, delay: 1.2  },
  { x: 55, y: 50, size: 2, speed: 0.10, delay: 0.6  },
  { x: 90, y: 70, size: 3, speed: 0.05, delay: 0.9  },
  { x: 30, y: 10, size: 4, speed: 0.07, delay: 0.4  },
  { x: 70, y: 90, size: 2, speed: 0.06, delay: 1.5  },
  { x: 50, y: 25, size: 3, speed: 0.08, delay: 0.1  },
];

export default function Hero() {
  const heroRef      = useRef<HTMLElement>(null);
  const layer1Ref    = useRef<HTMLDivElement>(null); // slowest – deep bg
  const layer2Ref    = useRef<HTMLDivElement>(null); // mid – bokeh
  const layer3Ref    = useRef<HTMLDivElement>(null); // mid – image
  const layer4Ref    = useRef<HTMLDivElement>(null); // text – fastest fade
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf: number;
    let lastY = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y === lastY) return;
        lastY = y;

        const heroH = heroRef.current?.offsetHeight ?? window.innerHeight;
        const progress = Math.min(y / heroH, 1); // 0→1 as user scrolls past hero

        // Layer 1 — deep background drifts slowest
        if (layer1Ref.current) {
          layer1Ref.current.style.transform = `translateY(${y * 0.5}px) scale(1.1)`;
        }
        // Layer 2 — bokeh / orbs
        if (layer2Ref.current) {
          layer2Ref.current.style.transform = `translateY(${y * 0.3}px)`;
          layer2Ref.current.style.opacity   = String(1 - progress * 0.6);
        }
        // Layer 3 — dish image
        if (layer3Ref.current) {
          layer3Ref.current.style.transform = `translateY(${y * 0.22}px)`;
          layer3Ref.current.style.opacity   = String(1 - progress * 1.4);
        }
        // Layer 4 — text (fastest, fades out quickest)
        if (layer4Ref.current) {
          layer4Ref.current.style.transform = `translateY(${y * 0.12}px)`;
          layer4Ref.current.style.opacity   = String(Math.max(0, 1 - progress * 2.2));
        }

        setScrolled(y > 50);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Split title chars for staggered animation
  const words = ['Where', 'Every', 'Sip', 'Tells', 'a', 'Story'];

  return (
    <section ref={heroRef} id="hero" className={styles.hero} aria-label="Hero">

      {/* ── LAYER 1: Deep background image (slowest parallax) ── */}
      <div ref={layer1Ref} className={styles.layer1} aria-hidden="true">
        <div className={styles.bgBase} />
        {/* Diagonal light beam */}
        <div className={styles.lightBeam1} />
        <div className={styles.lightBeam2} />
        {/* Radial glow spots */}
        <div className={styles.glowSpot1} />
        <div className={styles.glowSpot2} />
        <div className={styles.glowSpot3} />
      </div>

      {/* ── LAYER 2: Bokeh / floating particles (mid parallax) ── */}
      <div ref={layer2Ref} className={styles.layer2} aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left:             `${p.x}%`,
              top:              `${p.y}%`,
              width:            `${p.size}px`,
              height:           `${p.size}px`,
              animationDelay:   `${p.delay}s`,
              animationDuration:`${3 + p.speed * 80}s`,
            }}
          />
        ))}
        {/* Large bokeh blobs */}
        <div className={styles.bokeh1} />
        <div className={styles.bokeh2} />
        <div className={styles.bokeh3} />
        <div className={styles.bokeh4} />
      </div>

      {/* ── LAYER 3: Right image (medium parallax) ── */}
      <div ref={layer3Ref} className={styles.layer3} aria-hidden="true">
        <div className={styles.dishSphere}>
          <Image
            src="/hero-dish.png"
            alt=""
            fill
            priority
            sizes="60vw"
            className={styles.dishBg}
          />
          <div className={styles.dishVignette} />
        </div>
      </div>

      {/* ── LAYER 4: Text content (fastest, snappiest) ── */}
      <div ref={layer4Ref} className={styles.layer4}>
        <div className={styles.content}>

          {/* Eyebrow */}
          <div className={styles.eyebrow}>
            <div className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>Est. 2010 · New Delhi, India</span>
            <div className={styles.eyebrowLine} />
          </div>

          {/* Main title — word-by-word animated */}
          <h1 ref={titleRef} className={styles.title}>
            {words.map((word, i) => (
              <span key={word + i} className={styles.titleWord} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                {word === 'Sip' || word === 'Tells' || word === 'a' || word === 'Story'
                  ? <em className={styles.titleEM}>{word}</em>
                  : word
                }{' '}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Crafted with passion. Served with grace.<br />
            Where Indian warmth meets European artistry.
          </p>

          {/* CTAs */}
          <div className={styles.ctas}>
            <a href="#reservation" className={styles.ctaPrimary} id="hero-book-btn">
              <span className={styles.ctaBg} />
              <Calendar size={17} />
              <span>Book a Table</span>
              <span className={styles.ctaArrow}>→</span>
            </a>
            <a href="#menu" className={styles.ctaSecondary}>
              Explore Menu
            </a>
          </div>

          {/* Social proof strip */}
          <div className={styles.proofStrip}>
            <div className={styles.avatarStack}>
              {['👨','👩','🧔','🧕','👱'].map((e, i) => (
                <div key={i} className={styles.avatar} style={{ zIndex: 5 - i, transform: `translateX(${-i * 10}px)` }}>
                  {e}
                </div>
              ))}
            </div>
            <div className={styles.proofText}>
              <div className={styles.proofStars}>
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
              </div>
              <span><strong>30,000+</strong> happy guests · 4.9 on Google</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── FIXED HUD elements (don't parallax) ── */}

      {/* Vertical award badge on right edge */}
      <div className={styles.awardBadge} aria-hidden="true">
        <div className={styles.awardRing}>
          <span className={styles.awardInner}>✦</span>
        </div>
        <div className={styles.awardText}>
          {'Best Cafe Delhi 2023'.split('').map((c, i) => (
            <span key={i} style={{ transform: `rotate(${i * 18 - 90}deg)`, transformOrigin: '0 56px' }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Chef's special floating card — right mid */}
      <div className={`${styles.floatCard} ${scrolled ? styles.floatCardHidden : ''}`}>
        <div className={styles.floatCardTop}>
          <span className={styles.floatCardEmoji}>☕</span>
          <span className={styles.floatCardBadge}>Today&apos;s Special</span>
        </div>
        <div className={styles.floatCardName}>Saffron Latte</div>
        <div className={styles.floatCardPrice}>₹345</div>
        <div className={styles.floatCardBar}>
          <div className={styles.floatCardBarFill} />
        </div>
        <div className={styles.floatCardMeta}>Only 8 left today</div>
      </div>

      {/* Scroll line indicator */}
      <div className={styles.scrollLine} aria-hidden="true">
        <div className={styles.scrollLineFill} />
      </div>
      <a href="#about" className={styles.scrollBtn} aria-label="Scroll down">
        <ArrowDown size={14} />
      </a>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} />

    </section>
  );
}
