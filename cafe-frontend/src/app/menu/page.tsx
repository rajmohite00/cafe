'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, Star, Clock, Flame, Leaf, ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import type { MenuItem } from '@/context/CartContext';
import { menuItems as staticMenuItems, categories as staticCategories } from '@/data/menuData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './menu.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── MongoDB ObjectId pattern ─────────────────────────────────────────────
const isMongoId = (s: string) => /^[0-9a-f]{24}$/i.test(s);

// ── Map API item → CartContext MenuItem shape ────────────────────────────
function apiToMenuItem(d: any): MenuItem {
  return {
    slug:        d._id,
    name:        d.name        || 'Dish',
    desc:        d.tag         || d.category || '',
    longDesc:    d.tag         || '',
    price:       d.price       || 0,
    img:         d.emoji       || '🍽',
    badge:       d.tag         || '',
    category:    d.category    || 'Menu',
    calories:    '',
    prepTime:    '',
    isVeg:       true,
    ingredients: [],
    rating:      0,
    reviews:     0,
  };
}

// ── Card Component ────────────────────────────────────────────────────────
function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isEmoji = !item.img.startsWith('/');
  // Admin items (MongoDB ID) don't have individual detail pages
  const href    = isMongoId(item.slug) ? '#' : `/menu/${item.slug}`;

  return (
    <div onClick={() => router.push(href)} className={styles.card} style={{ cursor: 'pointer' }}>
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
          {item.rating > 0 && (
            <span className={styles.cardRating}><Star size={11} fill="currentColor" /> {item.rating}</span>
          )}
        </div>
        <h3 className={styles.cardName}>{item.name}</h3>
        <p className={styles.cardDesc}>{item.desc}</p>
        <div className={styles.cardInfo}>
          {item.prepTime && <span className={styles.infoTag}><Clock size={11} /> {item.prepTime}</span>}
          {item.calories  && <span className={styles.infoTag}><Flame size={11} /> {item.calories}</span>}
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
    </div>
  );
}

// ── Full Menu Page ────────────────────────────────────────────────────────
export default function FullMenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query,          setQuery]          = useState('');
  const [apiItems,       setApiItems]       = useState<MenuItem[]>([]);

  // Fetch admin-added menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (!API_URL) return;
        const res  = await fetch(`${API_URL}/api/data/menu`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const visible = data.data
            .filter((d: any) => d.visible !== false)
            .map(apiToMenuItem);
          setApiItems(visible);
        }
      } catch { /* silent fallback */ }
    };
    fetchMenu();
    const id = setInterval(fetchMenu, 30_000);
    return () => clearInterval(id);
  }, []);

  // Always show static dishes + append admin-added dishes
  const allItems = useMemo(() => [...staticMenuItems, ...apiItems], [apiItems]);

  // Build category list dynamically
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(allItems.map(i => i.category)))],
    [allItems]
  );

  const filtered = useMemo(() => {
    let list = activeCategory === 'All'
      ? allItems
      : allItems.filter(i => i.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, query, allItems]);

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
