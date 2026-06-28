'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../blog.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Comprehensive static article database mapped by slug
const staticArticles: Record<string, any> = {
  'art-of-masala-chai': {
    title: 'The Art of Perfect Masala Chai',
    category: 'Brewing Guide',
    author: 'Chef Rajesh',
    date: 'March 28, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
    content: `
      <p>Masala Chai is more than just a morning beverage in India; it is a ritual, a comfort, and a celebration of rich spices. At Raj's Cafe, our recipe has been perfected over 15 years to deliver the ultimate cup every single time.</p>
      
      <h3>1. Selecting Whole Spices</h3>
      <p>Never rely on pre-ground tea masala. We crush green cardamom pods, fresh ginger root, whole cloves, black pepper, and cinnamon bark right before brewing to release their essential oils.</p>
      
      <h3>2. The Simmering Process</h3>
      <p>First, bring water and crushed spices to a rolling boil for 3 to 4 minutes. This infuses the water with deep aromatic flavors before the tea leaves or milk are added.</p>
      
      <h3>3. The Golden Ratio</h3>
      <p>We use strong CTC Assam tea leaves to withstand the rich milk. The ideal ratio is 1 part water to 1 part full-fat milk, boiled together until the chai turns a rich golden-caramel shade.</p>
      
      <blockquote style="border-left: 3px solid var(--amber); padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: var(--brown-mid);">
        "Serving chai in an authentic clay kulhad adds an unforgettable earthy aroma that elevates every sip."
      </blockquote>
    `,
  },
  'single-origin-india': {
    title: "India's Hidden Coffee Belt: Coorg to Araku",
    category: 'Coffee Origins',
    author: 'Meera Nair',
    date: 'March 15, 2026',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    content: `
      <p>When coffee enthusiasts think of specialty beans, Ethiopia or Colombia often come to mind. However, India's shade-grown specialty coffees from Coorg, Chikmagalur, and the Araku Valley are quietly winning global accolades.</p>
      
      <h3>Shade-Grown Excellence</h3>
      <p>Unlike full-sun plantations in South America, Indian coffee is grown under a dual canopy of silver oaks, jackfruit, and spice trees. This slow-ripening process infuses the beans with subtle notes of cardamom, nutmeg, and dark chocolate.</p>
    `,
  },
  'v60-pour-over-guide': {
    title: 'Brewing V60 Like a Barista Champion',
    category: 'Brewing Guide',
    author: 'Arjun Mehta',
    date: 'March 5, 2026',
    readTime: '8 min read',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    content: `
      <p>Pour-over coffee is 90% technique. The Hario V60 is legendary for producing a clean, bright, and nuanced cup when brewed correctly.</p>
      <h3>Water & Grind Size</h3>
      <p>Use medium-fine ground beans (similar to sea salt) and filtered water heated to precisely 92°C to 94°C.</p>
    `,
  },
  'filter-coffee-south-india': {
    title: 'South Indian Filter Coffee: A Cultural Deep Dive',
    category: 'Culture',
    author: 'Chef Rajesh',
    date: 'February 22, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    content: `
      <p>The iconic steel tumbler, the "degree" coffee tradition, and why South Indian filter coffee is one of the world's great coffee rituals.</p>
      <h3>The Decoction Magic</h3>
      <p>A slow brass-filter drip combined with hot frothy milk creates a strong, sweet, velvety cup unmatched in flavor depth.</p>
    `,
  },
  'sustainability-zero-waste': {
    title: 'Our Journey to a Zero-Waste Café',
    category: 'Sustainability',
    author: 'Meera Nair',
    date: 'February 10, 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    content: `
      <p>From composting coffee grounds to switching to plant-based packaging — Raj's Cafe's 2-year sustainability transformation story.</p>
    `,
  },
  'perfect-cold-brew': {
    title: 'Cold Brew at Home: The 24-Hour Protocol',
    category: 'Recipes',
    author: 'Arjun Mehta',
    date: 'January 30, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    content: `
      <p>Cold brew is slow, simple, and spectacular. Our barista shares the exact ratio, steep time, and serving tips for café-quality cold brew.</p>
    `,
  },
};

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadArticle = async () => {
      // Check static first
      if (staticArticles[slug]) {
        if (active) {
          setArticle(staticArticles[slug]);
          setLoading(false);
        }
        return;
      }

      // Check API if slug resembles an ID or external slug
      try {
        const res = await fetch(`${API_URL}/api/data/posts`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((p: any) => p._id === slug || p.slug === slug);
          if (found && active) {
            setArticle({
              title: found.title || 'Untitled Article',
              category: 'News',
              author: 'Admin',
              date: found.date
                ? new Date(found.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : new Date(found.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              readTime: '4 min read',
              img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
              content: `<p>${found.content || found.excerpt || 'Full story content coming soon.'}</p>`,
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('[BlogArticle] API error:', e);
      }

      // Fallback fallback generator
      if (active) {
        const formattedTitle = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setArticle({
          title: formattedTitle,
          category: 'Coffee Stories',
          author: "Raj's Cafe Team",
          date: 'March 2026',
          readTime: '4 min read',
          img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
          content: `
            <p>Welcome to our detailed article on <strong>${formattedTitle}</strong>. At Raj's Cafe, we take pride in sharing our passion for food, beverages, and hospitality.</p>
            <p>Explore our menu or visit us in person to experience our handcrafted drinks and artisan delicacies firsthand.</p>
          `,
        });
        setLoading(false);
      }
    };

    loadArticle();
    return () => { active = false; };
  }, [slug]);

  if (loading || !article) {
    return (
      <>
        <Navbar light />
        <main className={styles.main} style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--brown-mid)' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>☕ Loading article...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        <div className="container" style={{ paddingTop: '8rem', maxWidth: '840px' }}>
          {/* Back button */}
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--amber)',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '2rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Back to Coffee Stories
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <span className={styles.postCat} style={{ fontSize: '0.8rem', letterSpacing: '0.15em' }}>
              {article.category}
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                color: 'var(--brown)',
                margin: '0.75rem 0 1.25rem',
                lineHeight: 1.15,
              }}
            >
              {article.title}
            </h1>

            <div
              className={styles.postMeta}
              style={{
                fontSize: '0.85rem',
                gap: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(44,21,6,0.1)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} /> {article.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> {article.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> {article.readTime}
              </span>
            </div>
          </div>

          {/* Featured image */}
          <div
            style={{
              position: 'relative',
              height: '400px',
              borderRadius: 'var(--radius-lg, 16px)',
              overflow: 'hidden',
              marginBottom: '2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Image src={article.img} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
          </div>

          {/* Content */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Footer actions */}
          <div
            style={{
              marginTop: '3.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(44,21,6,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link href="/blog" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> More Articles
            </Link>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-outline" style={{ padding: '0.6rem 1rem' }}>
                <Share2 size={16} />
              </button>
              <button className="btn-outline" style={{ padding: '0.6rem 1rem' }}>
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
