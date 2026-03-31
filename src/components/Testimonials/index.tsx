import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const reviews = [
  {
    name: 'Priya Mehra',
    handle: '@priyamehra',
    rating: 5,
    text: 'The Saffron Latte is life-changing. I\'ve been coming to Raj\'s every weekend for a year and it never disappoints. The atmosphere is warm, intimate — like dining inside a dream.',
    origin: 'Google Review',
    avatar: '🧕',
  },
  {
    name: 'James Thornton',
    handle: '@jthornton_delhi',
    rating: 5,
    text: 'Best cafe in Delhi, no contest. We hosted our anniversary dinner here — private room, bespoke menu, impeccable service. Chef Raj personally came out to greet us. Unforgettable.',
    origin: 'TripAdvisor',
    avatar: '👨',
  },
  {
    name: 'Ananya Krishnan',
    handle: '@ananya.k',
    rating: 5,
    text: 'As a food blogger I\'ve eaten at hundreds of restaurants. Raj\'s routinely makes my top 5 every year. The Pistachio French Toast alone is worth the visit. Truly special.',
    origin: 'Zomato Review',
    avatar: '👩',
  },
  {
    name: 'Rohan Verma',
    handle: '@rohanv_eats',
    rating: 5,
    text: 'The coffee program here is world-class. Single-origin Araku beans, precision extraction, and the most beautiful latte art I\'ve ever seen in India. A true specialty coffee experience.',
    origin: 'Google Review',
    avatar: '🧔',
  },
  {
    name: 'Sophie Laurent',
    handle: '@sophie.l',
    rating: 5,
    text: 'Visiting from Paris and a colleague suggested Raj\'s Cafe. I was genuinely impressed — European quality with Indian soul. The heritage shakshuka rivals anything on rue Montorgueil.',
    origin: 'Google Review',
    avatar: '👱',
  },
  {
    name: 'Vikram Singh',
    handle: '@vikramsingh',
    rating: 5,
    text: 'Perfect work lunch spot. Amazing WiFi, great seating, and the calmest atmosphere any weekday. The truffle arancini are dangerously good. My entire team is obsessed now.',
    origin: 'Yelp Review',
    avatar: '🧑',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className={`section-pad ${styles.section}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">Guest Reviews</span>
          <h2 className="section-title">
            Loved by <em>Thousands</em>
          </h2>
          <p className="section-subtitle" style={{ marginInline: 'auto' }}>
            Don&apos;t take our word for it — here&apos;s what our guests say about their 
            experience at Raj&apos;s Cafe.
          </p>

          {/* Rating overview */}
          <div className={styles.ratingBar}>
            <div className={styles.ratingScore}>4.9</div>
            <div>
              <div className="stars">
                {[...Array(5)].map((_, i) => <span key={i} className="star">★</span>)}
              </div>
              <div className={styles.ratingMeta}>Based on 2,400+ reviews</div>
            </div>
            <div className={styles.ratingDivider} />
            <div className={styles.platforms}>
              {['Google', 'TripAdvisor', 'Zomato'].map(p => (
                <span key={p} className={styles.platform}>{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className={styles.grid}>
          {reviews.map((r, i) => (
            <div key={i} className={`${styles.card} glass-card`} style={{ animationDelay: `${i*0.1}s` }}>
              <div className={styles.cardTop}>
                <Quote size={24} className={styles.quoteIcon} strokeWidth={1.5} />
                <div className="stars">
                  {[...Array(r.rating)].map((_, si) => <span key={si} className="star">★</span>)}
                </div>
              </div>
              <p className={styles.reviewText}>{r.text}</p>
              <div className={styles.reviewer}>
                <div className={styles.avatar}>{r.avatar}</div>
                <div>
                  <div className={styles.reviewerName}>{r.name}</div>
                  <div className={styles.reviewerMeta}>{r.handle} · {r.origin}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
