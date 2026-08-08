'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, Banknote, Wallet, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './checkout.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type PayMethod = 'upi' | 'card' | 'cod' | 'wallet';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [step, setStep] = useState<'details' | 'payment' | 'done'>('details');
  const [payMethod, setPayMethod] = useState<PayMethod>('upi');
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>('Pending');
  const [liveMessage, setLiveMessage] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (placedOrderId && step === 'done') {
      const checkStatus = async () => {
        try {
          const res = await fetch(`${API_URL}/api/orders/${placedOrderId}`);
          const data = await res.json();
          if (data.success) {
            setLiveStatus(data.data.status);
            setLiveMessage(data.data.adminMessage || '');
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      };
      checkStatus();
      interval = setInterval(checkStatus, 5000);
    }
    return () => clearInterval(interval);
  }, [placedOrderId, step]);

  const gst = Math.round(totalPrice * 0.05);
  const delivery = totalPrice > 0 ? 40 : 0;
  const grandTotal = totalPrice + gst + delivery;

  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
    address: '', city: 'New Delhi', pincode: '',
    upiId: '', cardNo: '', cardName: '', expiry: '', cvv: '', walletPh: ''
  });

  // Auto-fill when user loads
  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, name: user.name, phone: user.phone, email: user.email }));
    }
  }, [user]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    // Validate required delivery fields
    if (!form.address.trim() || !form.pincode.trim() || !form.city.trim()) {
      alert('Please fill in your complete delivery address (address, city & pincode) before placing the order.');
      return;
    }

    // Ensure customerName is never empty — use user.name as fallback if form not yet auto-filled
    const customerName = form.name.trim() || user?.name || 'Guest';
    const customerEmail = form.email.trim() || user?.email || '';
    const customerPhone = form.phone.trim() || user?.phone || '';

    if (!customerName) {
      alert('Please fill in your full name in the delivery details.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        userId:        user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        address: `${form.address.trim()}, ${form.city.trim()} - ${form.pincode.trim()}`,
        paymentMethod: payMethod,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: grandTotal,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.message || `Failed to place order (${response.status})`);
      }

      // Order placed successfully
      setPlacedOrderId(data.data._id);

      // Cache the new order in localStorage for order history
      if (user?.id) {
        const cacheKey = `cafe_orders_${user.id}`;
        const existing = localStorage.getItem(cacheKey);
        const cached = existing ? JSON.parse(existing) : [];
        const newOrder = {
          ...data.data,
          status: data.data.status || 'Pending',
          adminMessage: data.data.adminMessage || '',
          paymentMethod: orderPayload.paymentMethod,
          address: orderPayload.address,
          items: orderPayload.items,
          totalAmount: orderPayload.totalAmount,
          createdAt: data.data.createdAt || new Date().toISOString(),
        };
        localStorage.setItem(cacheKey, JSON.stringify([newOrder, ...cached]));
      }

      clearCart();
      setStep('done');
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.message || 'There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'done') {
    return (
      <>
        <Navbar light />
        <main className={styles.main}>
          <div className={`container ${styles.empty}`}>
            <h2>No items to checkout</h2>
            <Link href="/#menu" className="btn-primary">Browse Menu</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === 'done') {
    return (
      <>
        <Navbar light />
        <main className={styles.main}>
          <div className={`container ${styles.successWrap}`}>
            <div className={styles.successCard}>
              <CheckCircle size={72} color="#2e7d32" strokeWidth={1.5} />
              <h1 className={styles.successTitle}>Order Placed! 🎉</h1>
              <p className={styles.successMsg}>
                Thank you for your order at <strong>Raj&apos;s Cafe</strong>! Your delicious meal is being prepared
                and will be ready in approximately <strong>25–35 minutes</strong>.
              </p>
              <div className={styles.successDetails}>
                <div className={styles.successRow}>
                  <span>Order ID</span>
                  <span className={styles.successVal}>RJC-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className={styles.successRow}>
                  <span>Order Status</span>
                  <span className={`${styles.statusBadge} ${liveStatus === 'Cancelled' ? styles.status_cancelled : styles.status_pending}`} 
                        style={{ color: liveStatus === 'Cancelled' ? '#d32f2f' : '#fbc02d', fontWeight: 'bold' }}>
                    {liveStatus}
                  </span>
                </div>
                {liveMessage && (
                  <div className={styles.adminNote}>
                    <strong>Note from Cafe:</strong> {liveMessage}
                  </div>
                )}
                <div className={styles.successRow}>
                  <span>Payment</span>
                  <span className={styles.successVal}>
                    {payMethod === 'upi' ? 'UPI' : payMethod === 'card' ? 'Card' : payMethod === 'cod' ? 'Cash on Delivery' : 'Wallet'}
                  </span>
                </div>
                <div className={styles.successRow}>
                  <span>Amount Paid</span>
                  <span className={`${styles.successVal} ${styles.successAmt}`}>₹{grandTotal}</span>
                </div>
              </div>
              <Link href="/" className="btn-primary">Back to Home</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <Link href="/cart" className={styles.backLink}><ArrowLeft size={16} /> Back to Cart</Link>
            <h1 className={styles.title}>Checkout</h1>
            <span className={styles.secure}><Lock size={14} /> Secure Checkout</span>
          </div>

          {/* Step indicator */}
          <div className={styles.steps}>
            <div className={`${styles.step} ${step === 'details' ? styles.stepActive : styles.stepDone}`}>
              <span>1</span> Delivery Details
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${step === 'payment' ? styles.stepActive : ''}`}>
              <span>2</span> Payment
            </div>
          </div>

          <div className={styles.layout}>
            {/* Left: Form */}
            <div className={styles.formSide}>
              {step === 'details' && (
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Delivery Details</h2>
                  <div className={styles.formGrid}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" name="name" value={form.name} onChange={handleInput} placeholder="Raj Kumar" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input className="form-input" name="phone" value={form.phone} onChange={handleInput} placeholder="+91 98765 43210" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Email Address</label>
                      <input className="form-input" name="email" value={form.email} onChange={handleInput} placeholder="raj@example.com" type="email" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Delivery Address *</label>
                      <input className="form-input" name="address" value={form.address} onChange={handleInput} placeholder="House/Flat No, Street, Area" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" name="city" value={form.city} onChange={handleInput} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PIN Code *</label>
                      <input className="form-input" name="pincode" value={form.pincode} onChange={handleInput} placeholder="110001" maxLength={6} required />
                    </div>
                  </div>
                  <button
                    className={styles.nextBtn}
                    disabled={!form.name || !form.phone || !form.address || !form.pincode}
                    onClick={() => setStep('payment')}
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Choose Payment Method</h2>

                  {/* Method selector */}
                  <div className={styles.methods}>
                    {([
                      { id: 'upi', label: 'UPI / QR Code', icon: <Smartphone size={20} />, desc: 'GPay, PhonePe, Paytm & more' },
                      { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, desc: 'Visa, Mastercard, RuPay' },
                      { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, desc: 'Paytm, Amazon Pay, Mobikwik' },
                      { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={20} />, desc: 'Pay when your order arrives' },
                    ] as const).map(m => (
                      <button
                        key={m.id}
                        className={`${styles.method} ${payMethod === m.id ? styles.methodActive : ''}`}
                        onClick={() => setPayMethod(m.id)}
                      >
                        <span className={styles.methodIcon}>{m.icon}</span>
                        <div>
                          <span className={styles.methodLabel}>{m.label}</span>
                          <span className={styles.methodDesc}>{m.desc}</span>
                        </div>
                        <span className={styles.methodRadio}>{payMethod === m.id ? '●' : '○'}</span>
                      </button>
                    ))}
                  </div>

                  {/* Payment inputs */}
                  <div className={styles.payInputs}>
                    {payMethod === 'upi' && (
                      <div className="form-group">
                        <label className="form-label">UPI ID *</label>
                        <input className="form-input" name="upiId" value={form.upiId} onChange={handleInput} placeholder="yourname@upi" />
                        <div className={styles.qrHint}>
                          <span className={styles.qrBox}>📱 Scan & Pay via any UPI app</span>
                        </div>
                      </div>
                    )}
                    {payMethod === 'card' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Card Number *</label>
                          <input className="form-input" name="cardNo" value={form.cardNo} onChange={handleInput} placeholder="4242 4242 4242 4242" maxLength={19} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Name on Card *</label>
                          <input className="form-input" name="cardName" value={form.cardName} onChange={handleInput} placeholder="Raj Kumar" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Expiry *</label>
                            <input className="form-input" name="expiry" value={form.expiry} onChange={handleInput} placeholder="MM/YY" maxLength={5} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV *</label>
                            <input className="form-input" name="cvv" value={form.cvv} onChange={handleInput} placeholder="•••" maxLength={3} type="password" />
                          </div>
                        </div>
                      </>
                    )}
                    {payMethod === 'wallet' && (
                      <div className="form-group">
                        <label className="form-label">Registered Mobile Number *</label>
                        <input className="form-input" name="walletPh" value={form.walletPh} onChange={handleInput} placeholder="+91 98765 43210" />
                      </div>
                    )}
                    {payMethod === 'cod' && (
                      <div className={styles.codNote}>
                        💰 Keep <strong>₹{grandTotal}</strong> ready in cash when your order arrives. Our delivery partner will not carry change.
                      </div>
                    )}
                  </div>

                  <div className={styles.payActions}>
                    <button className={styles.backStepBtn} onClick={() => setStep('details')}>← Change Details</button>
                    <button className={styles.placeOrderBtn} onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? (
                        <span className={styles.spinner}>⏳ Processing…</span>
                      ) : (
                        <><ShieldCheck size={16} /> Place Order — ₹{grandTotal}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary */}
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryItems}>
                {items.map(item => (
                  <div key={item.slug} className={styles.summaryItem}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}><span>Subtotal</span><span>₹{totalPrice}</span></div>
                <div className={styles.summaryLine}><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className={styles.summaryLine}><span>Delivery</span><span>₹{delivery}</span></div>
                <div className={`${styles.summaryLine} ${styles.totalLine}`}><span>Total</span><span>₹{grandTotal}</span></div>
              </div>
              <div className={styles.trustBadge}>
                <ShieldCheck size={14} color="#2e7d32" />
                <span>100% Secure & Encrypted</span>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
