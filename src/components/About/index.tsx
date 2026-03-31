import Image from 'next/image';
import { Droplets, Coffee, Users, Heart } from 'lucide-react';
import styles from './About.module.css';

const features = [
  { icon: Droplets, title: 'Cozy Atmosphere',       desc: 'We are committed to eco-friendly practice, from using biodegradable materials to sourcing locally.' },
  { icon: Coffee,   title: 'Artisanal Coffee',      desc: 'Our coffee is sourced from the finest regions around the world and roasted to perfection.' },
  { icon: Users,    title: 'Community Engagement',  desc: 'We believe in giving back to our community through events, and local collaboration.' },
  { icon: Heart,    title: 'Exceptional Service',   desc: 'Our friendly and knowledgeable staff are dedicated to providing you with the best service.' },
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

      <section id="sustainability" className={`section-pad ${styles.section}`}>
        <div className="container">
          <h2 className={`section-title ${styles.title}`}>Our Commitment to Sustainability</h2>

          <div className={styles.grid}>
            {/* Left image */}
            <div className={styles.imgCol}>
              <div className={styles.imgWrap}>
                <Image
                  src="/chef.png"
                  alt="Raj's Cafe team crafting coffee with care"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className={styles.img}
                />
                <div className={styles.imgOverlay} />
              </div>
            </div>

            {/* Right feature grid */}
            <div className={styles.featuresGrid}>
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className={styles.featureCard}>
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
