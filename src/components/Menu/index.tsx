'use client';

import { useState } from 'react';
import { Flame, Coffee, Soup, Cake, Star, Plus } from 'lucide-react';
import styles from './Menu.module.css';

const categories = [
  { id: 'signature', label: 'Signature', icon: Star   },
  { id: 'breakfast', label: 'Breakfast',  icon: Soup   },
  { id: 'coffee',    label: 'Coffee',     icon: Coffee },
  { id: 'desserts',  label: 'Desserts',   icon: Cake   },
  { id: 'hot',       label: 'Chef\'s Hot', icon: Flame  },
];

type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  tag?: string;
  gradient: string;
  emoji: string;
};

const menuItems: MenuItem[] = [
  // Signature
  { id:1,  name:'Raj\'s Golden Toast',   desc:'Sourdough, truffle ricotta, microgreens, 24k gold flake',  price:495, category:'signature', tag:'Bestseller',   gradient:'linear-gradient(135deg,#3D2B0A,#1A1710)', emoji:'🍞' },
  { id:2,  name:'Saffron Latte',         desc:'Single-origin espresso, Kashmiri saffron milk foam',       price:345, category:'signature', tag:'Award-Winning', gradient:'linear-gradient(135deg,#2B1A0A,#1A1710)', emoji:'☕' },
  { id:3,  name:'Heritage Shakshuka',    desc:'Heirloom tomatoes, sumac eggs, toasted cumin pita',        price:550, category:'signature', tag:'Chef\'s Pick',  gradient:'linear-gradient(135deg,#2E1506,#1A1710)', emoji:'🍳' },
  { id:4,  name:'Pistachio French Toast',desc:'Brioche, pistachio custard, rose compote, clotted cream',  price:620, category:'signature', tag:'Popular',       gradient:'linear-gradient(135deg,#1A2E1A,#1A1710)', emoji:'🥐' },

  // Breakfast
  { id:5,  name:'Full Raj Breakfast',    desc:'2 eggs, streaky bacon, sausage, grilled mushrooms, toast',  price:795, category:'breakfast', gradient:'linear-gradient(135deg,#2B1A0A,#1A1710)', emoji:'🍳' },
  { id:6,  name:'Masala Omelette',       desc:'Three eggs, caramelised onion, green chilies, coriander',   price:395, category:'breakfast', gradient:'linear-gradient(135deg,#2E1A06,#1A1710)', emoji:'🥚' },
  { id:7,  name:'Acai Power Bowl',       desc:'Acai base, seasonal berries, granola, local honey, seeds',  price:445, category:'breakfast', tag:'Vegan',         gradient:'linear-gradient(135deg,#1A0A2E,#1A1710)', emoji:'🫐' },
  { id:8,  name:'Avocado Toast Royale',  desc:'Dark rye, whipped feta, poached egg, everything spice',     price:475, category:'breakfast', gradient:'linear-gradient(135deg,#0A1A2E,#1A1710)', emoji:'🥑' },

  // Coffee
  { id:9,  name:'Flat White',            desc:'Double ristretto, 160ml micro-foam, latte art',              price:285, category:'coffee',    gradient:'linear-gradient(135deg,#2B1A0A,#1A1710)', emoji:'☕' },
  { id:10, name:'Cold Brew Reserve',     desc:'18-hour dark roast cold brew, served over obsidian ice',     price:325, category:'coffee',    tag:'Signature',     gradient:'linear-gradient(135deg,#0A1020,#1A1710)', emoji:'🧊' },
  { id:11, name:'Cardamom Cappuccino',   desc:'Espresso, steamed milk, hand-ground cardamom, cinnamon',     price:295, category:'coffee',    gradient:'linear-gradient(135deg,#2A1A1A,#1A1710)', emoji:'🫖' },
  { id:12, name:'Matcha Ceremony',       desc:'Ceremonial grade matcha, oat milk, maple, vanilla foam',     price:345, category:'coffee',    tag:'Vegan',         gradient:'linear-gradient(135deg,#0A2010,#1A1710)', emoji:'🍵' },

  // Desserts
  { id:13, name:'Dark Chocolate Fondant',desc:'Valrhona 72%, salted caramel, vanilla bean ice cream',        price:545, category:'desserts', tag:'Must Try',      gradient:'linear-gradient(135deg,#2A0A0A,#1A1710)', emoji:'🍫' },
  { id:14, name:'Gulab Jamun Brûlée',    desc:'Classic crème brûlée with infused rose jam centre',           price:395, category:'desserts', gradient:'linear-gradient(135deg,#2E1A06,#1A1710)', emoji:'🌹' },
  { id:15, name:'Mango Panna Cotta',     desc:'Alphonso mango, coconut cream, saffron jelly, pistachios',    price:425, category:'desserts', gradient:'linear-gradient(135deg,#2A1E00,#1A1710)', emoji:'🥭' },

  // Hot Dishes
  { id:16, name:'Truffle Arancini',      desc:'Arborio rice, black truffle, aged parmesan, aioli',           price:595, category:'hot',      tag:'Chef\'s Pick',  gradient:'linear-gradient(135deg,#2B1A0A,#1A1710)', emoji:'🍚' },
  { id:17, name:'Lamb Kofta Platter',    desc:'Spiced lamb, tzatziki, pomegranate molasses, warm pita',      price:895, category:'hot',      gradient:'linear-gradient(135deg,#2E100A,#1A1710)', emoji:'🥩' },
];

export default function Menu() {
  const [active, setActive] = useState<string>('signature');

  const filtered = menuItems.filter(item => item.category === active);

  return (
    <section id="menu" className={`section-pad ${styles.menu}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">Our Menu</span>
          <h2 className="section-title">
            Crafted With<br /><em>Intention & Soul</em>
          </h2>
          <p className="section-subtitle">
            Every dish is a story — ingredients sourced seasonally, plates composed with 
            care, and flavours balanced to linger long after your last bite.
          </p>
        </div>

        {/* Category tabs */}
        <div className={styles.tabBar} role="tablist" aria-label="Menu categories">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={active === id}
              className={`${styles.tab} ${active === id ? styles.tabActive : ''}`}
              onClick={() => setActive(id)}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className={styles.grid} role="tabpanel">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.card} glass-card`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Card image / emoji block */}
              <div className={styles.cardImg} style={{ background: item.gradient }}>
                <span className={styles.cardEmoji}>{item.emoji}</span>
                {item.tag && <span className="badge">{item.tag}</span>}
              </div>

              {/* Card content */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{item.name}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>₹{item.price}</span>
                  <button className={styles.addBtn} aria-label={`Add ${item.name} to order`}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View full menu CTA */}
        <div className={styles.fullMenuCta}>
          <div className={styles.ctaDivider} />
          <a href="#reservation" className="btn-primary">
            Reserve to Dine In
          </a>
          <div className={styles.ctaDivider} />
        </div>
      </div>
    </section>
  );
}
