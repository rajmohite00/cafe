'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './Reservation.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


export default function Reservation() {
  const [step, setStep]           = useState<1|2|3>(1);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    date: '', time: '', guests: '2', name: '', email: '', phone: '', occasion: '', requests: '',
  });


  const times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
                  '13:00','13:30','14:00','18:00','18:30','19:00','19:30','20:00','20:30','21:00'];

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/data/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          phone:    form.phone,
          date:     form.date,
          time:     form.time,
          guests:   Number(form.guests),
          occasion: form.occasion,
          requests: form.requests,
          status:   'pending',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to book');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <section id="reservation" className={`section-pad ${styles.section}`}>
        <div className="container">
          <div className={styles.successCard}>
            <CheckCircle size={56} className={styles.successIcon} strokeWidth={1.5} />
            <h2 className={styles.successTitle}>Reservation Confirmed!</h2>
            <p className={styles.successText}>
              Thank you, <strong>{form.name}</strong>. Your table for {form.guests} guests 
              on {form.date} at {form.time} has been requested. We&apos;ll send a confirmation 
              to <strong>{form.email}</strong> within 30 minutes.
            </p>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ date:'',time:'',guests:'2',name:'',email:'',phone:'',occasion:'',requests:'' }); }} className="btn-outline">
              Book Another Table
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reservation" className={`section-pad ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>

          {/* Left info panel */}
          <div className={styles.info}>
            <span className="section-label">Reservations</span>
            <h2 className="section-title">
              Reserve Your<br /><em>Perfect Table</em>
            </h2>
            <div className="gold-divider" />
            <p className={styles.infoBody}>
              Join us for breakfast, brunch, or an intimate dinner. We recommend 
              reserving in advance — weekends fill up fast.
            </p>

            <div className={styles.infoItems}>
              {[
                { icon: Clock, label: 'Opening Hours', val: 'Mon–Fri: 8am–10pm\nSat–Sun: 7am–11pm' },
                { icon: Calendar, label: 'Walk-ins Welcome', val: 'Subject to availability. Reservations recommended for groups of 4+.' },
                { icon: Users, label: 'Private Dining', val: 'Groups of 8–30 guests. Contact events@rajscafe.in' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className={styles.infoItem}>
                  <div className={styles.infoIcon}><Icon size={18} strokeWidth={1.5} /></div>
                  <div>
                    <div className={styles.infoLabel}>{label}</div>
                    <div className={styles.infoVal} style={{ whiteSpace: 'pre-line' }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className={`${styles.formWrap} glass-card`}>
            {/* Step indicator */}
            <div className={styles.steps}>
              {[1,2,3].map((s) => (
                <div key={s} className={styles.stepItem}>
                  <div className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''} ${step > s ? styles.stepDotDone : ''}`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={styles.stepLabel}>
                    {s===1?'Date & Time':s===2?'Party Size':'Your Details'}
                  </span>
                  {s < 3 && <ChevronRight size={14} className={styles.stepArrow} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className={styles.dateInput}
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => update('date', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Guests</label>
                      <select className="form-select" value={form.guests} onChange={e => update('guests', e.target.value)}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <div className={styles.timeGrid}>
                      {times.map(t => (
                        <button
                          key={t} type="button"
                          className={`${styles.timeBtn} ${form.time === t ? styles.timeBtnActive : ''}`}
                          onClick={() => update('time', t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    disabled={!form.date || !form.time}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="John Smith" value={form.name} onChange={e => update('name', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+91 98765 43210" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" placeholder="you@example.com" type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Occasion <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                    <select className="form-select" value={form.occasion} onChange={e => update('occasion', e.target.value)}>
                      <option value="">None</option>
                      <option>Birthday</option>
                      <option>Anniversary</option>
                      <option>Date Night</option>
                      <option>Business Lunch</option>
                      <option>Family Celebration</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Requests</label>
                    <textarea className="form-textarea" placeholder="Dietary requirements, seating preferences…" value={form.requests} onChange={e => update('requests', e.target.value)} />
                  </div>
                  <div className={styles.stepBtns}>
                    <button type="button" className="btn-outline" onClick={() => setStep(1)}>Back</button>
                    <button type="button" className="btn-primary" disabled={!form.name || !form.email || !form.phone} onClick={() => setStep(3)}>Review</button>
                  </div>
                </div>
              )}

              {/* Step 3 — Review */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.reviewTitle}>Confirm Your Reservation</h3>
                  <div className={styles.reviewGrid}>
                    {[
                      ['Date',    form.date],
                      ['Time',    form.time],
                      ['Guests',  `${form.guests} Guests`],
                      ['Name',    form.name],
                      ['Email',   form.email],
                      ['Phone',   form.phone],
                      form.occasion ? ['Occasion', form.occasion] : null,
                    ].filter(Boolean).map((row) => { const [k, v] = row as [string, string]; return (
                      <div key={k} className={styles.reviewRow}>
                        <span className={styles.reviewKey}>{k}</span>
                        <span className={styles.reviewVal}>{v}</span>
                      </div>
                    ); })}
                  </div>
                  {form.requests && (
                    <div className={styles.reviewNote}>
                      <span className={styles.reviewKey}>Requests</span>
                      <p className={styles.reviewVal}>{form.requests}</p>
                    </div>
                  )}
                  <div className={styles.stepBtns}>
                    <button type="button" className="btn-outline" onClick={() => setStep(2)} disabled={loading}>Edit</button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? '⏳ Booking...' : 'Confirm — Book Now'}
                    </button>
                  </div>
                  {error && (
                    <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
                      ⚠️ {error}
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
