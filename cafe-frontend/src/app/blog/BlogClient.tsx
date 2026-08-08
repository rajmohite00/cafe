'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './blog.module.css';

interface Post {
  slug: string; category: string; title: string; excerpt: string;
  img: string; author: string; date: string; readTime: string; featured: boolean;
}

const ALL_CATS = ['All', 'Brewing Guide', 'Coffee Origins', 'Recipes', 'Culture', 'Sustainability', 'News'];

export default function BlogClientPage({ initialPosts }: { initialPosts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? initialPosts
    : initialPosts.filter(p => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={`container ${styles.heroContent}`}>
            <span className="section-label">Coffee Stories</span>
            <h1 className={styles.heroTitle}>Sip, Read, Discover</h1>
            <p className={styles.heroSub}>
              Brewing guides, origin stories, recipes, and culture — straight from our cup to yours.
            </p>
          </div>
        </div>

        <div className="container">
          {/* Category filter — now functional */}
          <div className={styles.filters}>
            {ALL_CATS.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${activeCategory === c ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              No posts in this category yet.
            </p>
          )}

          {/* Featured post */}
          {featured && (
            <div className={styles.featured}>
              <div className={styles.featuredImgWrap}>
                <Image src={featured.img} alt={featured.title} fill className={styles.featuredImg} />
                <span className={styles.featuredBadge}>Featured</span>
              </div>
              <div className={styles.featuredBody}>
                <span className={styles.postCat}>{featured.category}</span>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.postMeta}>
                  <span className={styles.postAuthor}>✍️ {featured.author}</span>
                  <span className={styles.postDate}>{featured.date}</span>
                  <span className={styles.postRead}>☕ {featured.readTime}</span>
                </div>
                <Link href={`/blog/${featured.slug}`} className={`btn-primary ${styles.readBtn}`}>
                  Read Article →
                </Link>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className={styles.grid}>
            {rest.map(post => (
              <Link href={`/blog/${post.slug}`} key={`${post.slug}-${post.title}`} className={styles.card}>
                <div className={styles.cardImg}>
                  <Image src={post.img} alt={post.title} fill className={styles.cardImgEl} />
                  <span className={styles.postCatBadge}>{post.category}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
