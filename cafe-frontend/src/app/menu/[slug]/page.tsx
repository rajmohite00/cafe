'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Star, Clock, Flame, Leaf, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { menuItems } from '@/data/menuData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './item.module.css';

export default function MenuItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const item = menuItems.find(i => i.slug === slug);

  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item || item.isAvailable === false) {
    return (
      <>
        <Navbar light />
        <main style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.25rem', background: 'var(--cream)', padding: '4rem 1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🚫</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)', fontSize: '2.2rem' }}>
            {!item ? '404 — Item Not Found' : 'Item Currently Unavailable'}
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '450px', lineHeight: 1.6 }}>
            {!item
              ? 'Sorry, the menu item you are looking for does not exist or has been removed.'
              : `Sorry, ${item.name} is currently out of stock or unavailable. Please check back later or choose another item.`}
          </p>
          <div className="error-state-badge" style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
            Status: Out of Stock / Unavailable
          </div>
          <Link href="/menu" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Back to Menu
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const cartItem = items.find(i => i.slug === item.slug);
  const isEmoji = !item.img.startsWith('/');

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related items (same category, excluding current)
  const related = menuItems.filter(m => m.category === item.category && m.slug !== item.slug).slice(0, 3);

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <div className={`container ${styles.breadcrumbContent}`}>
            <Link href="/menu" className={styles.backLink}>
              <ArrowLeft size={14} /> Back to Menu
            </Link>
            <div className={styles.breadPath}>
              <span className={styles.breadParent}>Menu</span>
              <span className={styles.breadSep}>/</span>
              <span className={styles.breadCurrent}>{item.name}</span>
            </div>
          </div>
        </div>

        {/* Hero section */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            {/* Image */}
            <div className={styles.heroImg}>
              {isEmoji ? (
                <div className={styles.heroEmoji}>{item.img}</div>
              ) : (
                <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" priority />
              )}
              {item.badge && <span className={styles.heroBadge}>{item.badge}</span>}
            </div>

            {/* Info */}
            <div className={styles.heroInfo}>
              <div className={styles.infoTop}>
                <span className={styles.catLabel}>{item.category}</span>
                {item.isVeg && (
                  <span className={styles.vegBadge}><Leaf size={12} /> Pure Veg</span>
                )}
              </div>

              <h1 className={styles.itemName}>{item.name}</h1>

              {/* Rating */}
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(item.rating) ? 'var(--amber)' : 'none'} color="var(--amber)" />
                ))}
                <span className={styles.ratingVal}>{item.rating}</span>
                <span className={styles.ratingCount}>({item.reviews} reviews)</span>
              </div>

              <p className={styles.longDesc}>{item.longDesc}</p>

              {/* Quick stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <Clock size={18} color="var(--amber)" />
                  <div>
                    <span className={styles.statLabel}>Prep Time</span>
                    <span className={styles.statVal}>{item.prepTime}</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <Flame size={18} color="var(--amber)" />
                  <div>
                    <span className={styles.statLabel}>Calories</span>
                    <span className={styles.statVal}>{item.calories}</span>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className={styles.ingredients}>
                <h3 className={styles.ingredientsTitle}>Key Ingredients</h3>
                <div className={styles.ingredientsList}>
                  {item.ingredients.map(ing => (
                    <span key={ing} className={styles.ingredient}>
                      <Check size={10} /> {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price + Qty + Add */}
              <div className={styles.purchase}>
                <span className={styles.price}>₹{item.price}</span>

                <div className={styles.qtyRow}>
                  <div className={styles.qtyControl}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className={styles.qtyBtn} aria-label="Decrease quantity"><Minus size={14} /></button>
                    <span className={styles.qtyVal}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className={styles.qtyBtn} aria-label="Increase quantity"><Plus size={14} /></button>
                  </div>

                  <button className={`${styles.addCartBtn} ${added ? styles.addCartBtnDone : ''}`} onClick={handleAddToCart}>
                    {added ? (
                      <><Check size={16} /> Added to Cart!</>
                    ) : (
                      <><ShoppingCart size={16} /> Add to Cart — ₹{item.price * qty}</>
                    )}
                  </button>
                </div>

                {cartItem && (
                  <p className={styles.inCartNote}>
                    ✓ You have {cartItem.quantity} in your cart.{' '}
                    <Link href="/cart" className={styles.viewCartLink}>View Cart →</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related items */}
        {related.length > 0 && (
          <section className={styles.related}>
            <div className="container">
              <h2 className={styles.relatedTitle}>You Might Also Like</h2>
              <div className={styles.relatedGrid}>
                {related.map(r => {
                  const rIsEmoji = !r.img.startsWith('/');
                  return (
                    <Link key={r.slug} href={`/menu/${r.slug}`} className={styles.relatedCard}>
                      <div className={styles.relatedImg}>
                        {rIsEmoji ? (
                          <span className={styles.relatedEmoji}>{r.img}</span>
                        ) : (
                          <Image src={r.img} alt={r.name} fill style={{ objectFit: 'cover' }} sizes="200px" />
                        )}
                      </div>
                      <div className={styles.relatedInfo}>
                        <span className={styles.relatedName}>{r.name}</span>
                        <span className={styles.relatedPrice}>₹{r.price}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
