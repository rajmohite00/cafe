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
      <Navbar />
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
