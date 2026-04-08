import Image from 'next/image';
import { Droplets, Coffee, Users, Heart } from 'lucide-react';
import styles from './About.module.css';

const features = [
  { icon: Droplets, title: 'Cozy Atmosphere',      desc: 'Committed to eco-friendly practices — biodegradable materials, locally sourced ingredients, and zero-waste brewing.' },
  { icon: Coffee,   title: 'Artisanal Coffee',     desc: 'Beans sourced from India\'s finest estates, roasted in-house weekly, brewed to perfection every cup.' },
  { icon: Users,    title: 'Community Roots',      desc: 'Giving back through local events, artisan workshops, and collaborating with neighbourhood farmers.' },
  { icon: Heart,    title: 'Exceptional Service',  desc: 'Our warm, knowledgeable staff ensure every visit feels personal — from your first sip to the last bite.' },
];

export default function About() {
  return (
    <>
      {/* Top wave */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="var(--cream)"/>
        </svg>
      </div>

      <section id="about" className={`section-pad ${styles.section}`}>
        <div className="container">

          {/* Header */}
          <p className="section-label reveal" style={{ textAlign: 'center', display: 'block' }}>Our Story</p>
          <h2 className={`section-title ${styles.title} reveal delay-1`}>
            Our Commitment to Sustainability
          </h2>
          <p className={`${styles.titleSub} reveal delay-2`}>
            Every cup we pour is a promise — to the earth, our community, and your palate.
          </p>

          <div className={styles.grid}>

            {/* Left — image */}
            <div className={`${styles.imgCol} reveal-left`}>
              <div className={styles.imgWrap}>
                <Image
                  src="/chef.png"
                  alt="Chef at Raj's Cafe crafting coffee with care"
                  fill
                  sizes="(max-width: 900px) 90vw, 45vw"
                  className={styles.img}
                />
                <div className={styles.imgOverlay} />
              </div>

              {/* Floating year badge */}
              <div className={styles.imgBadge}>
                <span className={styles.badgeNum}>15+</span>
                <span className={styles.badgeTxt}>Years of Craft</span>
              </div>
            </div>

            {/* Right — feature cards */}
            <div className={styles.featuresGrid}>
              {features.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className={`${styles.featureCard} reveal delay-${i + 2}`}
                >
                  <div className={styles.featureIcon}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className={styles.featureTitle}>{title}</h3>
                    <p className={styles.featureDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Bottom wave */}
      <div className={styles.waveBottom} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1380,60 1440,40 L1440,80 L0,80 Z" fill="var(--cream-dark)"/>
        </svg>
      </div>
    </>
  );
}
