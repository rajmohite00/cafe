import styles from './BrewGuide.module.css';

const methods = [
  {
    name: 'Filter Coffee',
    icon: '🧺',
    time: '4–5 min',
    difficulty: 'Easy',
    steps: ['Fold filter into brass vessel', 'Add 2 tsp fine-ground Robusta', 'Pour hot water slowly', 'Let decoct drip — takes ~4 min', 'Mix with hot milk + sugar to taste'],
    tip: 'Use freshly ground coffee for the richest flavour.',
    color: '#C97A10',
  },
  {
    name: 'Pour Over V60',
    icon: '⚗️',
    time: '3–4 min',
    difficulty: 'Intermediate',
    steps: ['Rinse filter with hot water', 'Add 15g medium-ground coffee', 'Bloom with 30ml water, wait 30s', 'Pour in slow circles until 250ml', 'Enjoy at 88°C for best clarity'],
    tip: 'Water temperature matters — 90–93°C is the sweet spot.',
    color: '#1B4D5C',
  },
  {
    name: 'French Press',
    icon: '🫙',
    time: '4 min',
    difficulty: 'Easy',
    steps: ['Add 30g coarsely ground coffee', 'Pour 500ml water at 93°C', 'Stir gently, place lid on', 'Steep for exactly 4 minutes', 'Press slowly, pour immediately'],
    tip: 'Don\'t let it sit after pressing — it keeps brewing and turns bitter.',
    color: '#6B3F1E',
  },
];

export default function BrewGuide() {
  return (
    <section className={styles.section} id="brew-guide">

      <div className="container">
        <div className={styles.header}>
          <p className="section-label reveal" style={{ display: 'block', textAlign: 'center' }}>Brew At Home</p>
          <h2 className={`section-title ${styles.title} reveal delay-1`}>
            How to Brew Like We Do
          </h2>
          <p className={`section-subtitle ${styles.subtitle} reveal delay-2`}>
            Order our beans and recreate the café experience at home — step by step.
          </p>
        </div>

        <div className={styles.grid}>
          {methods.map((m, i) => (
            <div key={m.name} className={`${styles.card} reveal delay-${i + 1}`}>
              <div className={styles.cardTop} style={{ '--accent': m.color } as React.CSSProperties}>
                <span className={styles.cardIcon}>{m.icon}</span>
                <div>
                  <h3 className={styles.cardName}>{m.name}</h3>
                  <div className={styles.cardMeta}>
                    <span>⏱ {m.time}</span>
                    <span className={`${styles.badge} ${styles[`badge${m.difficulty.replace(' ', '')}`]}`}>
                      {m.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <ol className={styles.steps}>
                {m.steps.map((s, j) => (
                  <li key={j} className={styles.step}>
                    <span className={styles.stepNum} style={{ background: m.color }}>{j + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <div className={styles.tip}>
                <span className={styles.tipIcon}>💡</span>
                <span>{m.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
