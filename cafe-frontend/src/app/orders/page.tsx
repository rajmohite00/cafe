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
      <td class="item-name">${i.name}</td>
      <td class="text-center">${i.quantity}</td>
      <td class="text-right">₹${i.price.toFixed(2)}</td>
      <td class="text-right" style="font-weight:600;">₹${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join('');

  // Randomized widths for decorative barcode
  const randomBarcode = Array.from({length: 30}).map(() => `<div style="width:${Math.floor(Math.random() * 4) + 1}px; background:#334155;"></div>`).join('');

  const billHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Tax Invoice – Raj's Cafe #${order._id.slice(-6).toUpperCase()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
    
    :root {
      --brand: #c27803; 
      --brand-dark: #2C1506; 
      --text-main: #334155;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Inter', sans-serif; 
      background: #f8fafc; 
      color: var(--text-main); 
      -webkit-font-smoothing: antialiased;
    }
    
    .invoice-wrapper {
      max-width: 800px;
      margin: 40px auto;
      background: var(--bg);
      padding: 60px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      border-radius: 8px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 50px;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
    }

    .logo { 
      font-family: 'Playfair Display', serif; 
      font-size: 36px; 
      color: var(--brand-dark); 
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .logo span { color: var(--brand); }
    
    .company-details {
      color: var(--text-light);
      font-size: 13px;
      line-height: 1.6;
    }

    .invoice-title-container {
      text-align: right;
    }

    .invoice-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--brand-dark);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
      opacity: 0.1;
    }

    .invoice-number {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-main);
    }
    .invoice-date {
      font-size: 13px;
      color: var(--text-light);
      margin-top: 4px;
    }

    .billing-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-top: 30px;
      border-top: 2px solid var(--border);
    }

    .bill-box {
      width: 45%;
    }

    .bill-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-light);
      font-weight: 600;
      margin-bottom: 12px;
    }

    .customer-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--brand-dark);
      margin-bottom: 4px;
    }

    .customer-detail {
      font-size: 13px;
      color: var(--text-light);
      line-height: 1.5;
    }

    .status-badge { 
      display: inline-block; 
      padding: 6px 12px; 
      border-radius: 4px; 
      font-size: 11px; 
      font-weight: 600; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 12px;
    }
    .status-Completed { background: #dcfce7; color: #166534; }
    .status-Pending { background: #fef08a; color: #854d0e; }
    .status-Cancelled { background: #fee2e2; color: #991b1b; }
    .status-Ready { background: #dbeafe; color: #1e40af; }
    .status-Preparing { background: #ffedd5; color: #9a3412; }

    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 30px; 
    }
    
    thead th { 
      padding: 12px 16px; 
      background: #f8fafc;
      color: var(--text-light); 
      font-size: 11px; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      text-align: left; 
      font-weight: 600; 
      border-bottom: 2px solid var(--border);
    }
    
    thead th.text-right { text-align: right; }
    thead th.text-center { text-align: center; }
    
    tbody td {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
      color: var(--text-main);
    }
    
    tbody td.text-right { text-align: right; }
    tbody td.text-center { text-align: center; }
    
    .item-name {
      font-weight: 600;
      color: var(--brand-dark);
    }

    .totals { 
      width: 320px;
      margin-left: auto;
    }
    
    .total-row { 
      display: flex; 
      justify-content: space-between; 
      font-size: 14px; 
      padding: 12px 16px; 
      color: var(--text-main); 
    }
    
    .total-row.border-bottom {
      border-bottom: 1px solid var(--border);
    }
    
    .total-row.grand { 
      font-size: 18px; 
      font-weight: 700; 
      color: var(--brand-dark); 
      background: #f8fafc;
      border-radius: 8px;
      margin-top: 8px;
    }
    
    .grand span:last-child { 
      color: var(--brand); 
    }
    
    .footer { 
      margin-top: 60px; 
      padding-top: 30px; 
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .footer-msg {
      font-size: 12px; 
      color: var(--text-light); 
      line-height: 1.6; 
    }

    .thank-you { 
      font-family: 'Playfair Display', serif; 
      font-size: 20px; 
      color: var(--brand-dark); 
      margin-bottom: 8px; 
      font-style: italic; 
    }
    
    .barcode {
      display: flex; 
      height: 30px; 
      gap: 2px; 
      margin-bottom: 5px;
      opacity: 0.7;
    }

    @media print {
      body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice-wrapper { box-shadow: none; margin: 0; padding: 20px; max-width: 100%; border: none; }
    }
  </style>
</head>
<body>
<div class="invoice-wrapper">
  <div class="header-top">
    <div class="logo-container">
      <div class="logo">Raj's<span>Cafe</span></div>
      <div class="company-details">
        123 Connaught Place, New Delhi – 110001<br/>
        +91 98765 43210 &bull; rajscafe.in<br/>
        GSTIN: 07ABCDE1234F1Z5
      </div>
    </div>
    <div class="invoice-title-container">
      <div class="invoice-title">Tax Invoice</div>
      <div class="invoice-number">Invoice #${order._id.slice(-6).toUpperCase()}</div>
      <div class="invoice-date">Date: ${formatDate(order.createdAt)}</div>
    </div>
  </div>

  <div class="billing-row">
    <div class="bill-box">
      <div class="bill-title">Billed To</div>
      <div class="customer-name">${userName}</div>
      ${order.address ? `<div class="customer-detail">${order.address}</div>` : ''}
    </div>
    <div class="bill-box" style="text-align: right;">
      <div class="bill-title">Payment Method</div>
      <div class="customer-detail">${pmLabel}</div>
      <div class="status-badge status-${order.status}">${order.status}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th class="text-center">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div class="totals">
    <div class="total-row border-bottom"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
    <div class="total-row border-bottom"><span>GST (5%)</span><span>₹${gst.toFixed(2)}</span></div>
    <div class="total-row border-bottom"><span>Delivery</span><span>₹${delivery.toFixed(2)}</span></div>
    <div class="total-row grand"><span>Grand Total</span><span>₹${order.totalAmount.toFixed(2)}</span></div>
  </div>

  <div class="footer">
    <div class="footer-msg">
      <div class="thank-you">Thank you for your visit!</div>
      For feedback or queries: hello@rajscafe.in<br/>
      This is a computer-generated receipt and requires no signature.
    </div>
    <div class="barcode">
      ${randomBarcode}
    </div>
  </div>
</div>
<script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=800,height=900');
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

  // Cache key per user so different users don't mix history
  const cacheKey = user ? `cafe_orders_${user.id}` : null;

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res  = await fetch(`${API_URL}/api/orders/user/${user.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const fresh = data.data as Order[];

        // Merge fresh with cached: fresh data wins for same _id (status updates),
        // but keep cached-only orders so history never disappears on backend resets
        const cachedRaw = localStorage.getItem(cacheKey!);
        const cached: Order[] = cachedRaw ? JSON.parse(cachedRaw) : [];
        
        const mergedMap = new Map<string, Order>();
        // Put cached first (older), then fresh overrides
        cached.forEach(o => mergedMap.set(o._id, o));
        fresh.forEach(o => mergedMap.set(o._id, o));

        const merged = Array.from(mergedMap.values())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Save back to cache
        localStorage.setItem(cacheKey!, JSON.stringify(merged));
        setOrders(merged);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error(e);
      // On network error, show cached data so history is never blank
      if (cacheKey) {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached: Order[] = JSON.parse(cachedRaw);
          setOrders(cached);
        }
      }
    }
    finally { setLoading(false); }
  }, [user, cacheKey]);

  useEffect(() => {
    if (!user || !cacheKey) return;

    // Immediately show cached orders so page isn't blank on load
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      try {
        const cached: Order[] = JSON.parse(cachedRaw);
        if (cached.length > 0) {
          setOrders(cached);
          setLoading(false);
        }
      } catch { /* ignore parse errors */ }
    }

    fetchOrders();
    // Poll every 10s for status updates
    const interval = setInterval(fetchOrders, 10_000);
    return () => clearInterval(interval);
  }, [fetchOrders, user, cacheKey]);

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
