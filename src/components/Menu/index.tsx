import styles from './Menu.module.css';
import Image from 'next/image';

const menuItems = [
  { name: 'Cold Brew',        desc: 'Brewed slowly for a smooth.',                  price: 3.00,  img: '☕', badge: ''    },
  { name: 'Grilled Cheese',   desc: 'It is a classic comfort food with cheddar.',   price: 3.55,  img: '🧀', badge: ''    },
  { name: 'Chocolate Cake',   desc: 'A rich and moist cake topped with creamy.',    price: 2.95,  img: '🍰', badge: ''    },
  { name: 'Latte',            desc: 'Smooth and creamy.',                            price: 2.15,  img: '☕', badge: 'New' },
  { name: 'Caesar Salad',     desc: 'Crisp romaine tossed with dressing.',          price: 2.00,  img: '🥗', badge: 'New' },
  { name: 'Matcha Latte',     desc: 'A creamy and vibrant green tea.',              price: 1.80,  img: '🍵', badge: ''    },
  { name: 'Espresso Delight', desc: 'A rich and bold espresso shot.',               price: 2.95,  img: '☕', badge: ''    },
  { name: 'Almond Croissant', desc: 'A butter, flaky croissant with rich almond.',  price: 5.80,  img: '🥐', badge: ''    },
];

// Decorative SVGs
const BeanGroup = () => (
  <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.decorBean}>
    <ellipse cx="35" cy="50" rx="32" ry="22" stroke="#9E7550" strokeWidth="1.5" fill="none"/>
    <path d="M35 29 Q47 38 47 50 Q47 62 35 71" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M35 29 Q23 38 23 50 Q23 62 35 71" stroke="#9E7550" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="105" cy="30" rx="22" ry="15" stroke="#9E7550" strokeWidth="1.2" fill="none" opacity="0.7"/>
    <path d="M105 16 Q114 22 114 30 Q114 38 105 44" stroke="#9E7550" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7"/>
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
    <ellipse cx="70" cy="60" rx="32" ry="10" stroke="#8A7560" strokeWidth="1" fill="none" opacity="0.4"/>
  </svg>
);

export default function Menu() {
  const left  = menuItems.filter((_, i) => i % 2 === 0);
  const right = menuItems.filter((_, i) => i % 2 !== 0);

  return (
    <>
      {/* Top wave */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="var(--cream-dark)"/>
        </svg>
      </div>

      <section id="menu" className={`section-pad ${styles.section}`}>
        {/* Decorative illustrations */}
        <BeanGroup />
        <CupDecor />

        <div className="container">
          <div className={styles.header}>
            <h2 className={`section-title ${styles.title}`}>Our Menu</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', maxWidth: 560, marginInline: 'auto', marginTop: '0.75rem' }}>
              Welcome to Raj&apos;s Cafe! Here, we pride ourselves on offering a diverse selection
              of beverages and treats that cater to every taste.
            </p>
          </div>

          {/* 2-column list menu */}
          <div className={styles.menuGrid}>
            <div className={styles.menuCol}>
              {left.map(item => (
                <MenuItem key={item.name} item={item} />
              ))}
            </div>
            <div className={styles.menuCol}>
              {right.map(item => (
                <MenuItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* View full menu */}
          <div className={styles.ctaRow}>
            <a href="#" className={styles.viewFullBtn}>
              View Full Menu →
            </a>
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

function MenuItem({ item }: { item: typeof menuItems[0] }) {
  return (
    <div className={styles.menuItem}>
      <div className={styles.menuItemLeft}>
        <div className={styles.menuItemImg}>{item.img}</div>
        <div className={styles.menuItemInfo}>
          <div className={styles.menuItemNameRow}>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
            <span className={styles.menuItemName}>{item.name}</span>
            <div className={styles.dotLine} />
            <span className={styles.menuItemPrice}>$ {item.price.toFixed(2)}</span>
          </div>
          <p className={styles.menuItemDesc}>{item.desc}</p>
        </div>
      </div>
    </div>
  );
}
