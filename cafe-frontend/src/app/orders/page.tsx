'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './orders.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  adminMessage: string;
  paymentMethod: string;
  address: string;
  createdAt: string;
}

const STATUS_CONFIG = {
  Pending:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  icon: '⏳', label: 'Pending' },
  Preparing: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  icon: '👨‍🍳', label: 'Preparing' },
  Ready:     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)',  icon: '🔔', label: 'Ready for Pickup' },
  Completed: { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  icon: '✅', label: 'Completed' },
  Cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',   icon: '❌', label: 'Cancelled' },
};

const PM_LABEL: Record<string, string> = {
  upi: '📱 UPI / QR Code', card: '💳 Card', cod: '💵 Cash on Delivery', wallet: '👛 Wallet',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function downloadBill(order: Order, userName: string) {
  const subtotal   = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst        = Math.round(subtotal * 0.05);
  const delivery   = 40;
  const pm         = { upi: 'UPI / QR Code', card: 'Card', cod: 'Cash on Delivery', wallet: 'Wallet' };
  const pmLabel    = pm[order.paymentMethod as keyof typeof pm] || order.paymentMethod || 'N/A';

  const itemRows   = order.items.map(i => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8d8;color:#3d2208;font-size:14px;">${i.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8d8;text-align:center;color:#6b4c2a;font-size:14px;">${i.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8d8;text-align:right;color:#3d2208;font-size:14px;">₹${i.price}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8d8;text-align:right;font-weight:700;color:#3d2208;font-size:14px;">₹${i.price * i.quantity}</td>
    </tr>`).join('');

  const billHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Bill – Raj's Cafe #${order._id.slice(-6).toUpperCase()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Lato', sans-serif; background: #fff; color: #3d2208; }
    .bill { max-width: 600px; margin: 0 auto; padding: 40px 40px 24px; }
    .header { text-align: center; border-bottom: 2px solid #E8941A; padding-bottom: 24px; margin-bottom: 24px; }
    .logo { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #2C1506; margin-bottom: 4px; }
    .tagline { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #E8941A; font-weight: 700; }
    .address { font-size: 12px; color: #8A7560; margin-top: 6px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 20px; background: #FFF8F0; border-radius: 8px; padding: 14px 16px; }
    .meta-col { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7560; }
    .meta-val { font-size: 13px; color: #2C1506; font-weight: 700; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #e8f5e9; color: #1b5e20; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    thead tr { background: #2C1506; }
    thead th { padding: 10px 12px; color: #F5EDD8; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; text-align: left; font-weight: 700; }
    thead th:last-child, thead th:nth-child(3), thead th:nth-child(2) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    .totals { margin-left: auto; width: 260px; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; color: #6b4c2a; border-bottom: 1px solid #f5edd8; }
    .total-row.grand { font-size: 18px; font-weight: 800; color: #2C1506; border-top: 2px solid #E8941A; border-bottom: none; padding-top: 10px; margin-top: 4px; }
    .grand span:last-child { color: #E8941A; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0e8d8; }
    .footer p { font-size: 12px; color: #8A7560; line-height: 1.8; }
    .thank { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #2C1506; margin-bottom: 6px; font-style: italic; }
    .watermark { font-size: 10px; color: #bbb; margin-top: 12px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .bill { padding: 20px; }
    }
  </style>
</head>
<body>
<div class="bill">
  <div class="header">
    <div class="logo">☕ Raj's Cafe</div>
    <div class="tagline">The Perfect Blend of Aroma &amp; Ambiance</div>
    <div class="address">123 Connaught Place, New Delhi – 110001 | +91 98765 43210 | rajscafe.in</div>
  </div>

  <div class="meta">
    <div class="meta-col">
      <span class="meta-label">Order ID</span>
      <span class="meta-val">#${order._id.slice(-6).toUpperCase()}</span>
    </div>
    <div class="meta-col">
      <span class="meta-label">Customer</span>
      <span class="meta-val">${userName}</span>
    </div>
    <div class="meta-col">
      <span class="meta-label">Date &amp; Time</span>
      <span class="meta-val">${formatDate(order.createdAt)}</span>
    </div>
    <div class="meta-col">
      <span class="meta-label">Payment</span>
      <span class="meta-val">${pmLabel}</span>
    </div>
    <div class="meta-col">
      <span class="meta-label">Status</span>
      <span class="status-badge">${order.status}</span>
    </div>
  </div>

  ${order.address ? `<p style="font-size:12px;color:#8A7560;margin-bottom:16px;">📍 <strong>Delivery Address:</strong> ${order.address}</p>` : ''}

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Unit Price</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
    <div class="total-row"><span>GST (5%)</span><span>₹${gst}</span></div>
    <div class="total-row"><span>Delivery</span><span>₹${delivery}</span></div>
    <div class="total-row grand"><span>Grand Total</span><span>₹${order.totalAmount}</span></div>
  </div>

  <div class="footer">
    <p class="thank">Thank you for dining with us! 🙏</p>
    <p>We hope you enjoyed your meal. Visit us again soon.<br/>
    For feedback or queries: <strong>hello@rajscafe.in</strong> | GST No: 07ABCDE1234F1Z5</p>
    <p class="watermark">This is a computer-generated receipt. No signature required.</p>
  </div>
</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=650,height=900');
  if (win) {
    win.document.write(billHtml);
    win.document.close();
  }
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res  = await fetch(`${API_URL}/api/orders/user/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setLastUpdated(new Date());
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
    // Real-time polling every 5s
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, user]);

  // ── Computed stats ──
  const totalSpent     = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.totalAmount, 0);
  const completedCount = orders.filter(o => o.status === 'Completed').length;
  const pendingCount   = orders.filter(o => ['Pending','Preparing','Ready'].includes(o.status)).length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
  const avgOrder       = completedCount > 0 ? Math.round(totalSpent / completedCount) : 0;
  const favouriteItem  = (() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(i => {
      counts[i.name] = (counts[i.name] || 0) + i.quantity;
    }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  })();

  if (authLoading || (!user && !authLoading)) {
    return <div className={styles.loadingScreen}><div className={styles.spinner} /></div>;
  }

  return (
    <>
      <Navbar light />
      <main className={styles.main}>
        <div className="container">

          {/* ── Header ── */}
          <div className={styles.header}>
            <div>
              <span className="section-label">My Account</span>
              <h1 className={styles.title}>Order History</h1>
              <p className={styles.subtitle}>
                Welcome back, <strong>{user!.name}</strong> · Live updates every 5s
                <span className={styles.liveIndicator}>
                  <span className={styles.liveDot} />
                  Live
                </span>
              </p>
            </div>
            <Link href="/#menu" className="btn-primary">+ New Order</Link>
          </div>

          {/* ── Stats Report Cards ── */}
          <div className={styles.statsGrid}>
            {[
              { label: 'Total Orders',       val: orders.length,                   color: '#E8941A', icon: '🛍️' },
              { label: 'Active Orders',       val: pendingCount,                    color: '#3B82F6', icon: '⏳' },
              { label: 'Completed',           val: completedCount,                  color: '#10B981', icon: '✅' },
              { label: 'Cancelled',           val: cancelledCount,                  color: '#EF4444', icon: '❌' },
              { label: 'Total Spent',         val: `₹${totalSpent.toLocaleString()}`, color: '#8B5CF6', icon: '💰' },
              { label: 'Avg. Order Value',    val: avgOrder > 0 ? `₹${avgOrder}` : '—', color: '#E8941A', icon: '📊' },
            ].map(s => (
              <div key={s.label} className={styles.statCard} style={{ '--accent': s.color } as React.CSSProperties}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statVal}>{s.val}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Favourite item banner */}
          {favouriteItem !== '—' && (
            <div className={styles.favBanner}>
              ⭐ Your favourite: <strong>{favouriteItem}</strong> — ordered most times
            </div>
          )}

          {/* ── Orders List ── */}
          <div className={styles.ordersSection}>
            <h2 className={styles.sectionTitle}>
              All Orders
              <span className={styles.orderCount}>{orders.length}</span>
            </h2>

            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Loading your orders…</p>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🍽️</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here once you place your first order.</p>
                <Link href="/#menu" className="btn-primary">Browse Our Menu</Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                  const isOpen = expanded === order._id;
                  const isActive = ['Pending','Preparing','Ready'].includes(order.status);

                  return (
                    <div
                      key={order._id}
                      className={`${styles.orderCard} ${isActive ? styles.orderCardActive : ''}`}
                      style={{ '--status-color': cfg.color, '--status-bg': cfg.bg, '--status-border': cfg.border } as React.CSSProperties}
                    >
                      {/* Active pulse bar */}
                      {isActive && <div className={styles.activeBar} />}

                      {/* Card header */}
                      <div className={styles.cardHeader} onClick={() => setExpanded(isOpen ? null : order._id)}>
                        <div className={styles.cardLeft}>
                          <span className={styles.orderNumber}>
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                        </div>

                        <div className={styles.cardCenter}>
                          <span className={styles.orderItems}>
                            {order.items.slice(0, 2).map(i => `${i.name} ×${i.quantity}`).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                          </span>
                        </div>

                        <div className={styles.cardRight}>
                          <span className={styles.orderAmount}>₹{order.totalAmount.toLocaleString()}</span>
                          <span className={styles.statusBadge} style={{
                            color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`
                          }}>
                            {cfg.icon} {cfg.label}
                          </span>
                          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>›</span>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isOpen && (
                        <div className={styles.cardBody}>
                          {/* Live status tracker for active orders */}
                          {isActive && (
                            <div className={styles.tracker}>
                              <div className={styles.trackerTitle}>🔴 Live Order Tracking</div>
                              <div className={styles.trackerSteps}>
                                {(['Pending','Preparing','Ready','Completed'] as const).map((s, i) => {
                                  const steps = ['Pending','Preparing','Ready','Completed'];
                                  const currentIdx = steps.indexOf(order.status);
                                  const done = i <= currentIdx;
                                  return (
                                    <div key={s} className={`${styles.trackerStep} ${done ? styles.trackerDone : ''} ${i === currentIdx ? styles.trackerCurrent : ''}`}>
                                      <div className={styles.trackerDot} />
                                      <span>{STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Admin message */}
                          {order.adminMessage && (
                            <div className={styles.adminMsg}>
                              <strong>💬 Message from Raj&apos;s Cafe:</strong>
                              <p>{order.adminMessage}</p>
                            </div>
                          )}

                          {/* Items breakdown */}
                          <div className={styles.itemsTable}>
                            <div className={styles.itemsHeader}>
                              <span>Item</span><span>Qty</span><span>Price</span><span>Total</span>
                            </div>
                            {order.items.map((item, i) => (
                              <div key={i} className={styles.itemRow}>
                                <span>{item.name}</span>
                                <span>×{item.quantity}</span>
                                <span>₹{item.price}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                            <div className={styles.itemsTotal}>
                              <span>Grand Total</span>
                              <span></span><span></span>
                              <span className={styles.totalAmount}>₹{order.totalAmount}</span>
                            </div>
                          </div>

                          {/* Delivery + payment info */}
                          <div className={styles.metaRow}>
                            {order.address && (
                              <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>📍 Address</span>
                                <span className={styles.metaVal}>{order.address}</span>
                              </div>
                            )}
                            {order.paymentMethod && (
                              <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Payment</span>
                                <span className={styles.metaVal}>{PM_LABEL[order.paymentMethod] || order.paymentMethod}</span>
                              </div>
                            )}
                          </div>

                          {/* Download bill — show for all non-pending orders */}
                          {(order.status === 'Completed' || order.status === 'Ready' || order.status === 'Preparing') && (
                            <button
                              className={styles.downloadBtn}
                              onClick={() => downloadBill(order, user!.name)}
                            >
                              📄 Download Bill (PDF)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
