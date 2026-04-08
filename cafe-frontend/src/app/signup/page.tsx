'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from '../login/auth.module.css';

export default function SignupPage() {
  const { register } = useAuth();
  const router       = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />

      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>☕</span>
          <div>
            <div className={styles.logoName}>Raj&apos;s Cafe</div>
            <div className={styles.logoTagline}>The Perfect Blend</div>
          </div>
        </Link>

        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join us to order food & book tables online</p>

        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Raj Mohite"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Repeat password"
                value={form.confirm}
                onChange={e => update('confirm', e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Creating Account…' : 'Create My Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link href="/login" className={styles.switchLink}>Sign in</Link>
        </p>

        <Link href="/" className={styles.backLink}>← Back to Cafe</Link>
      </div>
    </div>
  );
}
