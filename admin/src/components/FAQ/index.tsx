'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'Do you have vegetarian and vegan options?',
    a: 'Absolutely! Over 40% of our menu is vegetarian or vegan. All dishes are clearly labelled, and our kitchen team is trained to accommodate dietary requirements. Please inform your server when you arrive.',
  },
  {
    q: 'Is parking available near the cafe?',
    a: 'Yes — there is a dedicated parking lot adjacent to the building (free for up to 2 hours with cafe validation). Street parking is also available on Connaught Place Road. We also recommend Ola/Uber for weekend visits.',
  },
  {
    q: 'How far in advance should I book a table?',
    a: 'For weekday dining, 24 hours in advance is usually sufficient. For weekends and special events, we recommend booking at least 3–5 days ahead. Private dining rooms require 1–2 weeks notice.',
  },
  {
    q: 'Can you accommodate large groups or private events?',
    a: 'Absolutely! We have a private dining room for up to 30 guests and can arrange bespoke menus, live stations, and décor for corporate events, birthdays, anniversaries, and more. Contact us at events@rajscafe.in.',
  },
  {
    q: 'Do you cater to food allergies?',
    a: 'Yes. Please share allergy details when making a reservation or informing your server. We handle gluten-free, nut-free, dairy-free, and other dietary needs with care. Cross-contamination protocols are strictly followed.',
  },
  {
    q: 'Is the cafe child-friendly?',
    a: 'We love families! We have high chairs, a dedicated kids\' menu with fun presentations, and a warm, welcoming atmosphere. Baby-changing facilities are also available in the restrooms.',
  },
  {
    q: 'What coffee beans do you use?',
    a: 'We source 100% single-origin beans from estates in Coorg, Chikmagalur, and Araku Valley — freshly roasted weekly by our in-house roaster. Featured origins rotate seasonally on our specialty board.',
  },
  {
    q: 'Do you have Wi-Fi for remote workers?',
    a: 'Yes! We have dedicated high-speed Wi-Fi. Our cafe has a quiet work-friendly zone on the upper level, available Monday to Friday, 8am–4pm. Power outlets are available at all tables.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className={`section-pad ${styles.faq}`}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">
              Answers to Your<br /><em>Questions</em>
            </h2>
            <p className="section-subtitle">
              Everything you need to know before your visit — from dietary options
              to parking and private events.
            </p>
            <div className={styles.contactNote}>
              Still have questions?{' '}
              <a href="mailto:hello@rajscafe.in" className={styles.contactLink}>
                hello@rajscafe.in
              </a>
            </div>
          </div>

          <div className={styles.accordion}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}
              >
                <button
                  className={styles.question}
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  id={`faq-q-${i}`}
                  aria-controls={`faq-a-${i}`}
                >
                  <span className={styles.questionNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.questionText}>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${open === i ? styles.chevronOpen : ''}`}
                    strokeWidth={2}
                  />
                </button>
                <div
                  className={styles.answer}
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  style={{ maxHeight: open === i ? '300px' : '0' }}
                >
                  <div className={styles.answerInner}>{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
