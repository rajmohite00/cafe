'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Hero.module.css';

/* ══════════════════════════════════════════════
   CONSTANTS — tune to your frame set
══════════════════════════════════════════════ */
const FIRST_FRAME    = 1;
const TOTAL_FRAMES   = 240;
const STEAM_FROM     = 220;    // frame where kettle is gone, only steam
const FPS            = 18;     // playback speed
const BASE_URL       = '/coffee-frames/ezgif-frame-';
const EXT            = '.jpg';

function pad3(n: number) { return String(n).padStart(3, '0'); }
function url(n: number)  { return `${BASE_URL}${pad3(n)}${EXT}`; }

/* ══════════════════════════════════════════════
   Frame preloader + canvas player hook
══════════════════════════════════════════════ */
function useCoffeePlayer(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [loaded, setLoaded] = useState(false);
  const imgsRef  = useRef<HTMLImageElement[]>([]);
  const idxRef   = useRef(0);          // current frame index (0-based)
  const phaseRef = useRef<'fill'|'steam'>('fill');

  /* Preload every frame */
  useEffect(() => {
    let done = 0;
    const total = TOTAL_FRAMES - FIRST_FRAME + 1;
    const imgs: HTMLImageElement[] = [];

    for (let n = FIRST_FRAME; n <= TOTAL_FRAMES; n++) {
      const img = new Image();
      img.src = url(n);
      img.onload = img.onerror = () => {
        done++;
        if (done === total) {
          imgsRef.current = imgs;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
  }, []);

  /* Canvas playback loop */
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgs  = imgsRef.current;
    const total = imgs.length;
    const steamIdx = STEAM_FROM - FIRST_FRAME; // 0-based index of steam start

    // Size canvas to first frame
    const first = imgs[0];
    if (first?.naturalWidth) {
      canvas.width  = first.naturalWidth;
      canvas.height = first.naturalHeight;
    }

    let frameIdx = 0;
    let phase: 'fill'|'steam' = 'fill';

    const interval = setInterval(() => {
      const img = imgs[frameIdx];
      if (img?.complete && img.naturalWidth) {
        if (frameIdx === 0 && img.naturalWidth) {
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      if (phase === 'fill') {
        frameIdx++;
        if (frameIdx >= total) {
          phase    = 'steam';
          frameIdx = steamIdx;
        }
      } else {
        frameIdx++;
        if (frameIdx >= total) frameIdx = steamIdx; // loop steam
      }

      idxRef.current   = frameIdx;
      phaseRef.current = phase;
    }, 1000 / FPS);

    return () => clearInterval(interval);
  }, [loaded, canvasRef]);

  return loaded;
}

/* ══════════════════════════════════════════════
   Hero Component
══════════════════════════════════════════════ */
export default function Hero() {
  const heroRef  = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mxRef    = useRef(0);
  const myRef    = useRef(0);
  const rafRef   = useRef<number>(0);

  const ready = useCoffeePlayer(canvasRef);

  /* Mouse parallax for subtle text drift */
  const onMouse = useCallback((e: MouseEvent) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    mxRef.current = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    myRef.current = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  }, []);

  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      const y = window.scrollY;
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      const p = Math.min(y / h, 1);
      const mx = mxRef.current, my = myRef.current;

      // Text: slight parallax + fade on scroll
      if (textRef.current) {
        textRef.current.style.transform =
          `translateY(${y * 0.12 + my * 6}px) translateX(${mx * 10}px)`;
        textRef.current.style.opacity = String(Math.max(0, 1 - p * 2));
      }

      // Dark overlay: lightens/darkens slightly with scroll
      if (overlayRef.current) {
        const extra = p * 0.25;
        overlayRef.current.style.opacity = String(0.48 + extra);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [onMouse]);

  return (
    <section ref={heroRef} id="hero" className={styles.hero}>

      {/* ── Full-screen video canvas (actual frames) ── */}
      <div className={styles.canvasWrap}>
        {!ready && (
          <div className={styles.loadScreen} aria-hidden="true">
            <div className={styles.loadRing} />
            <p className={styles.loadTxt}>Brewing your experience…</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${ready ? styles.canvasVisible : ''}`}
          aria-hidden="true"
        />
      </div>

      {/* ── Dark cinematic overlay so text is readable ── */}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

      {/* ── Gradient overlays for depth ── */}
      <div className={styles.gradLeft}   aria-hidden="true" />
      <div className={styles.gradBottom} aria-hidden="true" />

      {/* ── Text content ── */}
      <div ref={textRef} className={styles.content}>

        <h1 className={styles.headline}>
          The Perfect<br />
          <em className={styles.accent}>Aroma</em>
          <span className={styles.dimAnd}> &amp; </span>
          <em>Ambiance</em>
        </h1>

        <div className={styles.divider} />

        <p className={styles.sub}>
          Ethically sourced, hand-crafted with love — every sip tells
          the story of our roots. Experience India&apos;s finest café culture.
        </p>

        <div className={styles.stats}>
          {[
            { n: '10K+', l: 'Happy Customers' },
            { n: '50+',  l: 'Specialty Drinks' },
            { n: '15+',  l: 'Years of Craft' },
          ].map(s => (
            <div key={s.l} className={styles.stat}>
              <span className={styles.statNum}>{s.n}</span>
              <span className={styles.statLbl}>{s.l}</span>
            </div>
          ))}
        </div>

        <div className={styles.ctas}>
          <a href="#menu"        className={styles.ctaBtn}   id="hero-explore">
            Explore Menu →
          </a>
          <a href="#reservation" className={styles.ctaGhost} id="hero-reserve">
            Book a Table
          </a>
        </div>

      </div>

      {/* Scroll-down hint */}
      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollTxt}>Scroll</span>
      </div>

      {/* Bottom wave */}
      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path d="M0,45 C360,90 720,0 1080,45 C1260,68 1380,30 1440,45 L1440,90 L0,90Z"
            fill="#E8D9BB"/>
        </svg>
      </div>

    </section>
  );
}
