'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`section-pad ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-label" style={{ color: 'var(--amber-light)' }}>Get in Touch</span>
          <h2 className="section-title" style={{ color: 'var(--cream)' }}>Send Us a <em>Message</em></h2>
          <div className="gold-divider" style={{ margin: '1rem auto' }} />
          <p className={styles.subtitle}>
            Have a question, feedback, or inquiry about private events? Send us a note and we&apos;ll get back to you promptly.
          </p>
        </div>

        <div className={styles.formCardWrap}>
          <div className={`${styles.formCard} glass-card`}>
            {submitted ? (
              <div className={styles.successState}>
                <CheckCircle size={52} className={styles.successIcon} />
                <h3 className={styles.successTitle}>Message Sent Successfully!</h3>
                <p className={styles.successText}>
                  Thank you, <strong>{form.name}</strong>. We have received your message and will reply to <strong>{form.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div className={styles.errorBanner}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: 'rgba(240,230,208,0.8)' }} htmlFor="contact-name">
                      Name <span style={{ color: 'var(--amber-light)' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-input"
                      placeholder="Your Full Name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'rgba(240,230,208,0.8)' }} htmlFor="contact-email">
                      Email <span style={{ color: 'var(--amber-light)' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'rgba(240,230,208,0.8)' }} htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    className="form-input"
                    placeholder="General Inquiry, Feedback, Catering..."
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'rgba(240,230,208,0.8)' }} htmlFor="contact-message">
                    Message <span style={{ color: 'var(--amber-light)' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    className="form-textarea"
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
