import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './blog.module.css';

export const metadata = {
  title:       "Coffee Stories — Raj's Cafe Blog",
  description: "Explore brewing guides, coffee origins, recipes, and stories from the heart of Raj's Cafe kitchen.",
};

// ── Static fallback posts ────────────────────────────────────────────────
const staticPosts = [
  {
    slug:     'art-of-masala-chai',
    category: 'Brewing Guide',
    title:    'The Art of Perfect Masala Chai',
    excerpt:  'From selecting whole spices to achieving the perfect milk-to-tea ratio — the secrets our chai master has refined over 15 years.',
    img:      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
    author:   'Chef Rajesh',
    date:     'March 28, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    slug:     'single-origin-india',
    category: 'Coffee Origins',
    title:    "India's Hidden Coffee Belt: Coorg to Araku",
    excerpt:  "India produces some of the world's most underrated specialty coffee. We trace our beans from the hills of Coorg to the valleys of Araku.",
    img:      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    author:   'Meera Nair',
    date:     'March 15, 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    slug:     'v60-pour-over-guide',
    category: 'Brewing Guide',
    title:    'Brewing V60 Like a Barista Champion',
    excerpt:  'Pour-over coffee is 90% technique. We break down bloom time, pour patterns, grind size, and water temperature — everything matters.',
    img:      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    author:   'Arjun Mehta',
    date:     'March 5, 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    slug:     'filter-coffee-south-india',
    category: 'Culture',
    title:    'South Indian Filter Coffee: A Cultural Deep Dive',
    excerpt:  'The iconic steel tumbler, the "degree" coffee tradition, and why South Indian filter coffee is one of the world\'s great coffee rituals.',
    img:      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    author:   'Chef Rajesh',
    date:     'Feb 22, 2026',
    readTime: '6 min read',
    featured: false,
  },
  {
    slug:     'sustainability-zero-waste',
    category: 'Sustainability',
    title:    'Our Journey to a Zero-Waste Café',
    excerpt:  "From composting coffee grounds to switching to plant-based packaging — Raj's Cafe's 2-year sustainability transformation story.",
    img:      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    author:   'Meera Nair',
    date:     'Feb 10, 2026',
    readTime: '4 min read',
    featured: false,
  },
  {
    slug:     'perfect-cold-brew',
    category: 'Recipes',
    title:    'Cold Brew at Home: The 24-Hour Protocol',
    excerpt:  'Cold brew is slow, simple, and spectacular. Our barista shares the exact ratio, steep time, and serving tips for café-quality cold brew.',
    img:      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    author:   'Arjun Mehta',
    date:     'Jan 30, 2026',
    readTime: '5 min read',
    featured: false,
  },
];

// ── Default image bank for admin-created posts ───────────────────────────
const defaultImages = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
];

// ── Fetch published posts from admin backend ──────────────────────────────
async function getApiPosts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res  = await fetch(`${API_URL}/api/data/posts`, {
      next: { revalidate: 30 }, // refresh every 30s
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      const published = data.data.filter((p: any) => p.status === 'published');
      return published.map((p: any, idx: number) => ({
        slug:     p._id,
        category: 'News',
        title:    p.title    || 'Untitled',
        excerpt:  p.excerpt  || '',
        img:      defaultImages[idx % defaultImages.length],
        author:   'Admin',
        date:     p.date
          ? new Date(p.date).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
          : new Date(p.createdAt).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }),
        readTime: '3 min read',
        featured: idx === 0,
      }));
    }
  } catch (e) {
    console.error('[Blog] Failed to fetch posts from API:', e);
  }
  return [];
}

const cats = ['All', 'Brewing Guide', 'Coffee Origins', 'Recipes', 'Culture', 'Sustainability', 'News'];

export default async function BlogPage() {
  const apiPosts = await getApiPosts();
  // Show API posts first (if any), then append static posts below
  const allPosts = apiPosts.length > 0
    ? [...apiPosts, ...staticPosts]
    : staticPosts;

  const featured = allPosts[0];
  const rest     = allPosts.slice(1);

  return (
    <>
      <Navbar light />
      <main className={styles.main}>

        {/* Hero banner */}
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

          {/* Category filter */}
          <div className={styles.filters}>
            {cats.map(c => (
              <button key={c} className={`${styles.filterBtn} ${c === 'All' ? styles.filterActive : ''}`}>
                {c}
              </button>
            ))}
          </div>

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
                <Link
                  href={`/blog/${featured.slug}`}
                  className={`btn-primary ${styles.readBtn}`}
                >
                  Read Article →
                </Link>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className={styles.grid}>
            {rest.map(post => (
              <Link
                href={`/blog/${post.slug}`}
                key={`${post.slug}-${post.title}`}
                className={styles.card}
              >
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
