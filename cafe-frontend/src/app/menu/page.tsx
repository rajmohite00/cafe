'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, Star, Clock, Flame, Leaf, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { menuItems, categories, MenuItem } from '@/data/menuData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './menu.module.css';

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

  const isEmoji = !item.img.startsWith('/');

  return (
    <Link href={`/menu/${item.slug}`} className={styles.card}>
      <div className={styles.cardImg}>
        {isEmoji ? (
          <span className={styles.cardEmoji}>{item.img}</span>
        ) : (
          <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 90vw, 300px" />
        )}
        {item.badge && <span className={styles.cardBadge}>{item.badge}</span>}
        {item.isVeg && (
          <span className={styles.vegDot} title="Pure Vegetarian">
            <Leaf size={10} />
          </span>
        )}
      </div>
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
            {added ? <><Check size={13} /> Added!</> : <><ShoppingCart size={13} /> Add</>}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function FullMenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, query]);

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        {/* Hero banner */}
        <div className={styles.heroBanner}>
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={`container ${styles.heroContent}`}>
            <Link href="/" className={styles.backLink}><ArrowLeft size={15} /> Back to Home</Link>
            <h1 className={styles.heroTitle}>Our Full Menu</h1>
            <p className={styles.heroSub}>Authentic Indian café flavours — every price in ₹</p>
          </div>
        </div>

        <div className="container">
          {/* Search + Filters */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search dishes…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
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
          </div>

          {/* Results count */}
          <p className={styles.resultCount}>
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'item' : 'items'}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {query ? ` for "${query}"` : ''}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map(item => <MenuCard key={item.slug} item={item} />)}
            </div>
          ) : (
            <div className={styles.noResults}>
              <span>🍽️</span>
              <p>No items found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
