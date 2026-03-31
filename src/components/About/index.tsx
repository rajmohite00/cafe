import Image from 'next/image';
import { Award, Clock, Leaf } from 'lucide-react';
import styles from './About.module.css';

const pillars = [
  { icon: Award,  title: 'Award-Winning',   desc: 'Recognized by TimeOut Delhi & Indian Cafe Awards 2023.' },
  { icon: Clock,  title: 'Est. 2010',        desc: 'Over 15 years crafting memorable dining experiences.' },
  { icon: Leaf,   title: 'Farm-to-Table',    desc: 'Seasonal ingredients sourced from local organic farmers.' },
];

export default function About() {
  return (
    <section id="about" className={`section-pad ${styles.about}`}>
      <div className="container">
        <div className={styles.grid}>

          {/* Left — Story */}
          <div className={styles.storyCol}>
            <span className="section-label">Our Story</span>
            <h2 className="section-title">
              A Cafe Born From<br /><em>Passion & Heritage</em>
            </h2>
            <div className="gold-divider" />
            <p className={styles.body}>
              In 2010, Chef Raj Sharma opened a small corner cafe in Connaught Place 
              with a singular dream — to merge the warmth of an Indian home kitchen with 
              the precision of European culinary technique.
            </p>
            <p className={styles.body} style={{ marginTop: '1.25rem' }}>
              Today, Raj&apos;s Cafe has grown into one of Delhi&apos;s most beloved dining 
              destinations — celebrated for its handcrafted, seasonal menus, single-origin 
              coffee program, and an atmosphere that makes every guest feel like family.
            </p>

            {/* Pillars */}
            <div className={styles.pillars}>
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className={`${styles.pillar} glass-card`}>
                  <div className={styles.pillarIcon}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className={styles.pillarTitle}>{title}</h3>
                    <p className={styles.pillarDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#menu" className="btn-primary" style={{ display: 'inline-flex', marginTop: '2.5rem' }}>
              Explore Our Menu
            </a>
          </div>

          {/* Right — Chef image + decorative elements */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <Image
                src="/chef.png"
                alt="Chef Raj Sharma — founder and head chef of Raj's Cafe"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className={styles.chefImg}
              />
              <div className={styles.imgOverlay} />
            </div>

            {/* Quote card */}
            <div className={`${styles.quoteCard} glass-card`}>
              <div className={styles.quoteMarks}>&ldquo;</div>
              <p className={styles.quoteText}>
                Cooking is my love letter to every guest who walks through our door.
              </p>
              <div className={styles.quoteAuthor}>
                <div className={styles.quoteDot} />
                <span>Chef Raj Sharma</span>
              </div>
            </div>

            {/* Experience badge */}
            <div className={styles.expBadge}>
              <span className={styles.expNum}>15</span>
              <span className={styles.expLabel}>Years<br />Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
