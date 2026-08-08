import BlogClientPage from './BlogClient';

export const metadata = {
  title:       "Coffee Stories — Raj's Cafe Blog",
  description: "Explore brewing guides, coffee origins, recipes, and stories from the heart of Raj's Cafe kitchen.",
};

const staticPosts = [
  {
    slug: 'art-of-masala-chai', category: 'Brewing Guide',
    title: 'The Art of Perfect Masala Chai',
    excerpt: 'From selecting whole spices to achieving the perfect milk-to-tea ratio — the secrets our chai master has refined over 15 years.',
    img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
    author: 'Chef Rajesh', date: 'March 28, 2026', readTime: '5 min read', featured: true,
  },
  {
    slug: 'single-origin-india', category: 'Coffee Origins',
    title: "India's Hidden Coffee Belt: Coorg to Araku",
    excerpt: "India produces some of the world's most underrated specialty coffee. We trace our beans from the hills of Coorg to the valleys of Araku.",
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    author: 'Meera Nair', date: 'March 15, 2026', readTime: '7 min read', featured: false,
  },
  {
    slug: 'v60-pour-over-guide', category: 'Brewing Guide',
    title: 'Brewing V60 Like a Barista Champion',
    excerpt: 'Pour-over coffee is 90% technique. We break down bloom time, pour patterns, grind size, and water temperature — everything matters.',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    author: 'Arjun Mehta', date: 'March 5, 2026', readTime: '8 min read', featured: false,
  },
  {
    slug: 'filter-coffee-south-india', category: 'Culture',
    title: 'South Indian Filter Coffee: A Cultural Deep Dive',
    excerpt: "The iconic steel tumbler, the 'degree' coffee tradition, and why South Indian filter coffee is one of the world's great coffee rituals.",
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    author: 'Chef Rajesh', date: 'Feb 22, 2026', readTime: '6 min read', featured: false,
  },
  {
    slug: 'sustainability-zero-waste', category: 'Sustainability',
    title: 'Our Journey to a Zero-Waste Café',
    excerpt: "From composting coffee grounds to switching to plant-based packaging — Raj's Cafe's 2-year sustainability transformation story.",
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    author: 'Meera Nair', date: 'Feb 10, 2026', readTime: '4 min read', featured: false,
  },
  {
    slug: 'perfect-cold-brew', category: 'Recipes',
    title: 'Cold Brew at Home: The 24-Hour Protocol',
    excerpt: 'Cold brew is slow, simple, and spectacular. Our barista shares the exact ratio, steep time, and serving tips for café-quality cold brew.',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    author: 'Arjun Mehta', date: 'Jan 30, 2026', readTime: '5 min read', featured: false,
  },
];

const defaultImages = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
];

async function getApiPosts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cafe-backend-azure.vercel.app';
    const res = await fetch(`${API_URL}/api/data/posts`, { next: { revalidate: 30 } });
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data
        .filter((p: any) => p.status === 'published')
        .map((p: any, idx: number) => ({
          slug: p._id, category: 'News',
          title: p.title || 'Untitled',
          excerpt: p.excerpt || '',
          img: defaultImages[idx % defaultImages.length],
          author: 'Admin',
          date: new Date(p.date || p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: '3 min read',
          featured: idx === 0,
        }));
    }
  } catch { /* silent — static posts always show */ }
  return [];
}

export default async function BlogPage() {
  const apiPosts = await getApiPosts();
  const allPosts = apiPosts.length > 0 ? [...apiPosts, ...staticPosts] : staticPosts;
  return <BlogClientPage initialPosts={allPosts} />;
}
