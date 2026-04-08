'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Clock, Flame, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { menuItems, categories, MenuItem } from '@/data/menuData';
import styles from './Menu.module.css';

const BeanGroup = () => (
  <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.decorBean}>
    <ellipse cx="35" cy="50" rx="32" ry="22" stroke="#9E7550" strokeWidth="1.5" fill="none"/>
    <path d="M35 29 Q47 38 47 50 Q47 62 35 71" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M35 29 Q23 38 23 50 Q23 62 35 71" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="105" cy="30" rx="22" ry="15" stroke="#9E7550" strokeWidth="1.2" fill="none" opacity="0.7"/>
    <ellipse cx="115" cy="75" rx="16" ry="11" stroke="#9E7550" strokeWidth="1" fill="none" opacity="0.5"/>
  </svg>
);

const CupDecor = () => (
  <svg viewBox="0 0 140 200" fill="none" className={styles.decorCup}>
    <path d="M25 60 L35 160 Q40 175 70 175 Q100 175 105 160 L115 60 Z" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <ellipse cx="70" cy="60" rx="45" ry="14" stroke="#8A7560" strokeWidth="1.5" fill="none"/>
    <path d="M115 75 Q132 75 132 92 Q132 109 115 109" stroke="#8A7560" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M52 35 Q56 18 60 35" stroke="#8A7560" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M68 28 Q72 12 76 28" stroke="#8A7560" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isEmoji = item.img.startsWith('/') === false;

  return (
    <Link href={`/menu/${item.slug}`} className={styles.card}>
      {/* Image / emoji */}
      <div className={styles.cardImg}>
        {isEmoji ? (
          <span className={styles.cardEmoji}>{item.img}</span>
        ) : (
          <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 90vw, 320px" />
        )}
        {item.badge && <span className={styles.cardBadge}>{item.badge}</span>}
        {item.isVeg && (
          <span className={styles.vegDot} title="Pure Vegetarian">
            <Leaf size={10} />
          </span>
        )}
      </div>

      {/* Content */}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardCategory}>{item.category}</span>
          <span className={styles.cardRating}><Star size={11} fill="currentColor" /> {item.rating}</span>
        </div>
        <h3 className={styles.cardName}>{item.name}</h3>
        <p className={styles.cardDesc}>{item.desc}</p>

        <div className={styles.cardInfo}>
          <span className={styles.infoTag}><Clock size={11} /> {item.prepTime}</span>
          <span className={styles.infoTag}><Flame size={11} /> {item.calories}</span>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>₹{item.price}</span>
          <button
            className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
          >
            {added ? '✓ Added' : <><ShoppingCart size={13} /> Add</>}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = (activeCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory)
  ).slice(0, 6); // show only 6 on homepage — full list is on /menu

  return (
    <>
      {/* Top wave */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="var(--cream-dark)"/>
        </svg>
      </div>

      <section id="menu" className={`section-pad ${styles.section}`}>
        <BeanGroup />
        <CupDecor />

        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Our Menu</span>
            <h2 className={`section-title ${styles.title}`}>Crafted with Love &amp; Spice</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', maxWidth: 560, marginInline: 'auto', marginTop: '0.75rem' }}>
              Authentic Indian flavours, locally sourced ingredients &amp; every price in ₹. Welcome to Raj&apos;s Cafe.
            </p>
          </div>

          {/* Category filter */}
          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Card grid */}
          <div className={styles.menuGrid}>
            {filtered.map(item => (
              <MenuCard key={item.slug} item={item} />
            ))}
          </div>

          {/* View full menu link */}
          <div className={styles.ctaRow}>
            <Link href="/menu" className={styles.viewFullBtn}>
              View Full Menu →
            </Link>
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
