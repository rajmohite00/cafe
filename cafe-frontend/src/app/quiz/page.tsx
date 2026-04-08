'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './quiz.module.css';

const questions = [
  {
    id: 1,
    q: 'How do you like your coffee to taste?',
    opts: [
      { label: 'Bold & Intense',    icon: '🔥', val: 'bold'   },
      { label: 'Smooth & Balanced', icon: '☕', val: 'smooth' },
      { label: 'Bright & Fruity',   icon: '🍊', val: 'fruity' },
      { label: 'Creamy & Sweet',    icon: '🍮', val: 'sweet'  },
    ],
  },
  {
    id: 2,
    q: 'When do you usually have your coffee?',
    opts: [
      { label: 'First thing in the morning', icon: '🌅', val: 'morning'   },
      { label: 'Mid-day pick-me-up',         icon: '⏰', val: 'midday'   },
      { label: 'After meals',                icon: '🍽️', val: 'postmeal' },
      { label: 'Anytime! I love coffee',     icon: '💛', val: 'anytime'  },
    ],
  },
  {
    id: 3,
    q: 'What\'s your comfort level with coffee?',
    opts: [
      { label: 'Newbie — keep it simple',   icon: '🌱', val: 'newbie'  },
      { label: 'Casual drinker',            icon: '😊', val: 'casual'  },
      { label: 'Daily ritualist',           icon: '🔄', val: 'ritual'  },
      { label: 'Specialty coffee nerd',     icon: '🧪', val: 'expert'  },
    ],
  },
];

const results: Record<string, { name: string; desc: string; emoji: string; price: string; slug: string }> = {
  bold:   { name: 'South Indian Filter Coffee', emoji: '☕', desc: 'Rich, full-bodied, and deeply satisfying — brewed through a traditional brass filter with our darkest roast.', price: '₹80', slug: 'filter-coffee' },
  smooth: { name: 'Masala Chai',               emoji: '🍵', desc: 'Perfectly spiced, creamy, and comforting — our award-winning blend of Assam tea, ginger, cardamom, and milk.', price: '₹60', slug: 'masala-chai' },
  fruity: { name: 'Cold Brew Coffee',          emoji: '🧊', desc: 'Bright, refreshing, and surprisingly sweet. Steeped 24 hours for a clean, naturally fruity finish.', price: '₹140', slug: 'cold-brew' },
  sweet:  { name: 'Saffron Latte',            emoji: '💛', desc: 'Velvety oat milk latte tinted gold with Kashmiri saffron — floral, creamy, and irresistibly unique.', price: '₹160', slug: 'saffron-latte' },
};

function getResult(answers: string[]) {
  const counts: Record<string, number> = {};
  answers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
  const key = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return results[key] ?? results['smooth'];
}

export default function QuizPage() {
  const [step, setStep]       = useState(0); // 0 = intro, 1-3 = questions, 4 = result
  const [answers, setAnswers] = useState<string[]>([]);

  const pick = (val: string) => {
    const next = [...answers, val];
    setAnswers(next);
    if (step < questions.length) setStep(s => s + 1);
    else setStep(4);
  };

  const restart = () => { setStep(0); setAnswers([]); };

  const question = questions[step - 1];
  const result   = step === 4 ? getResult(answers) : null;
  const progress = step === 0 ? 0 : (step / questions.length) * 100;

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Intro */}
          {step === 0 && (
            <div className={`${styles.card} ${styles.intro}`}>
              <div className={styles.introEmoji}>☕</div>
              <h1 className={styles.introTitle}>Find Your Perfect Cup</h1>
              <p className={styles.introSub}>
                Answer 3 quick questions and we&apos;ll recommend the ideal drink from Raj&apos;s Cafe menu — crafted just for your taste.
              </p>
              <button className={`btn-primary ${styles.startBtn}`} onClick={() => setStep(1)}>
                Start the Quiz →
              </button>
            </div>
          )}

          {/* Question */}
          {step >= 1 && step <= 3 && question && (
            <div className={styles.card}>
              {/* Progress */}
              <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.stepLabel}>Question {step} of {questions.length}</p>
              <h2 className={styles.question}>{question.q}</h2>
              <div className={styles.opts}>
                {question.opts.map(o => (
                  <button key={o.val} className={styles.opt} onClick={() => pick(o.val)}>
                    <span className={styles.optIcon}>{o.icon}</span>
                    <span className={styles.optLabel}>{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {step === 4 && result && (
            <div className={`${styles.card} ${styles.resultCard}`}>
              <div className={styles.resultEmoji}>{result.emoji}</div>
              <p className={styles.resultLabel}>Your perfect match is…</p>
              <h2 className={styles.resultName}>{result.name}</h2>
              <p className={styles.resultDesc}>{result.desc}</p>
              <div className={styles.resultPrice}>{result.price}</div>
              <div className={styles.resultBtns}>
                <Link href={`/menu/${result.slug}`} className="btn-primary">
                  Order Now →
                </Link>
                <button className="btn-outline" onClick={restart}>
                  Retake Quiz
                </button>
              </div>
              <p className={styles.resultNote}>
                Not your vibe? <Link href="/menu" style={{ color: 'var(--amber)' }}>Browse full menu</Link>
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
