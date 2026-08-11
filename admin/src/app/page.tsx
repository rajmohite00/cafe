'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, UtensilsCrossed, CalendarCheck, MessageSquare,
  Clock, Settings, Image as ImageIcon, Palette, FileText,
  TrendingUp, Plus, Trash2, Edit, Eye, EyeOff, Check, X,
  ChevronRight, LogOut, Bell, ShoppingCart, Save
} from 'lucide-react';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'orders' | 'menu' | 'reservations' | 'contacts' | 'hours' | 'seo' | 'design' | 'blog';

type MenuItem = { id: string; name: string; category: string; price: number; tag: string; emoji: string; visible: boolean; };
type Reservation = { id: string; name: string; date: string; time: string; guests: number; email: string; phone: string; status: 'pending' | 'confirmed' | 'cancelled'; occasion?: string; };
type Contact = { id: string; name: string; email: string; subject: string; message: string; status: 'unread' | 'read'; createdAt: string; };
type BlogPost = { id: string; title: string; excerpt: string; status: 'draft' | 'published'; date: string; };
type Order = {
  _id: string; customerName: string; customerEmail: string;
  customerPhone?: string; address?: string; paymentMethod?: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number; status: string; adminMessage?: string; createdAt: string;
};
type Activity = { _id: string; type: string; description: string; timestamp: string; ipAddress: string; };
type HourEntry = { day: string; open: string; close: string; closed: boolean; };
type SeoSettings = { title: string; description: string; keywords: string; ogImage: string; gaId: string; verification: string; };

const DEFAULT_HOURS: HourEntry[] = [
  { day: 'Monday – Friday', open: '08:00', close: '22:00', closed: false },
  { day: 'Saturday', open: '07:00', close: '23:00', closed: false },
  { day: 'Sunday', open: '07:00', close: '23:00', closed: false },
  { day: 'Public Holidays', open: '08:00', close: '20:00', closed: false },
];
const DEFAULT_SEO: SeoSettings = {
  title: "Raj's Cafe — Luxury Dining Experience",
  description: "Experience the finest cafe dining at Raj's Cafe. Artisanal coffee, gourmet cuisine, and an unforgettable atmosphere. Book your table today.",
  keywords: "Raj's Cafe, luxury cafe, fine dining, artisan coffee, gourmet food",
  ogImage: '/hero-dish.png',
  gaId: '',
  verification: '',
};

// ── Component ──────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [designColor, setDesignColor] = useState('#C9A84C');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hours, setHours] = useState<HourEntry[]>(DEFAULT_HOURS);
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const showError = (msg: string) => {
    setConnectionError(msg);
    setTimeout(() => setConnectionError(''), 5000);
  };

  // Helper function for API calls with error handling
  const apiCall = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        let errDetail = response.statusText;
        try {
          const errBody = await response.json();
          if (errBody && errBody.message) errDetail = errBody.message;
        } catch {}
        throw new Error(`HTTP ${response.status}${errDetail ? `: ${errDetail}` : ''}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }

      return data;
    } catch (error) {
      console.error(`API call to ${url} failed:`, error);
      throw error;
    }
  };

  // ── Computed stats ──
  const today = new Date().toDateString();
  const confirmedOrders = orders.filter(o => o.status === 'Completed');
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const totalIncome = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.totalAmount, 0);
  const todayIncome = orders.filter(o => o.status !== 'Cancelled' && new Date(o.createdAt).toDateString() === today).reduce((a, o) => a + o.totalAmount, 0);

  // ── localStorage cache helpers ──
  const saveCache = (key: string, value: unknown) => {
    try { localStorage.setItem(`admin_cache_${key}`, JSON.stringify(value)); } catch {}
  };
  const loadCache = <T,>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(`admin_cache_${key}`);
      return raw ? JSON.parse(raw) as T : null;
    } catch { return null; }
  };

  // ── Initial data load ──
  useEffect(() => {
    // Immediately show cached data so nothing is ever blank
    const cachedMenu = loadCache<MenuItem[]>('menu');
    const cachedRes = loadCache<Reservation[]>('reservations');
    const cachedCont = loadCache<Contact[]>('contacts');
    const cachedPosts = loadCache<BlogPost[]>('posts');
    if (cachedMenu && cachedMenu.length > 0) setMenuItems(cachedMenu);
    if (cachedRes && cachedRes.length > 0) setReservations(cachedRes);
    if (cachedCont && cachedCont.length > 0) setContacts(cachedCont);
    if (cachedPosts && cachedPosts.length > 0) setPosts(cachedPosts);

    const fetchAllData = async () => {
      setLoading(true);
      setConnectionError('');

      try {
        const [menu, res, cont, post] = await Promise.all([
          apiCall(`${API_URL}/api/data/menu`),
          apiCall(`${API_URL}/api/data/reservations`),
          apiCall(`${API_URL}/api/data/contacts`),
          apiCall(`${API_URL}/api/data/posts`),
        ]);

        if (menu.success && Array.isArray(menu.data)) {
          const mapped = menu.data.map((d: any) => ({ ...d, id: d._id || d.id }));
          setMenuItems(mapped);
          saveCache('menu', mapped);
        }
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((d: any) => ({ ...d, id: d._id || d.id }));
          setReservations(mapped);
          saveCache('reservations', mapped);
        }
        if (cont.success && Array.isArray(cont.data)) {
          const mapped = cont.data.map((d: any) => ({ ...d, id: d._id || d.id }));
          setContacts(mapped);
          saveCache('contacts', mapped);
        }
        if (post.success && Array.isArray(post.data)) {
          const mapped = post.data.map((d: any) => ({ ...d, id: d._id || d.id }));
          setPosts(mapped);
          saveCache('posts', mapped);
        }
      } catch (err: any) {
        console.error('Data fetch failed', err);
        // On failure, cached data is already shown - just log a subtle warning
        setConnectionError(`⚠ Could not reach backend: ${err.message}. Showing cached data.`);
        setTimeout(() => setConnectionError(''), 6000);
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const [hd, sd, dd] = await Promise.all([
          apiCall(`${API_URL}/api/data/settings/hours`),
          apiCall(`${API_URL}/api/data/settings/seo`),
          apiCall(`${API_URL}/api/data/settings/design`),
        ]);

        if (hd.success && hd.data?.value) {
          setHours(hd.data.value);
          saveCache('hours', hd.data.value);
        } else {
          const ch = loadCache<HourEntry[]>('hours');
          if (ch) setHours(ch);
        }
        if (sd.success && sd.data?.value) {
          setSeo({ ...DEFAULT_SEO, ...sd.data.value });
          saveCache('seo', sd.data.value);
        }
        if (dd.success && dd.data?.value?.color) {
          const c = dd.data.value.color;
          setDesignColor(c);
          document.documentElement.style.setProperty('--gold', c);
          saveCache('design', { color: c });
        }
      } catch (err: any) {
        console.error('Settings fetch failed', err);
      }
    };

    fetchAllData();
    fetchSettings();
  }, []);

  // ── Orders + Activities polling (real-time) ──
  useEffect(() => {
    // Show cached orders immediately
    const cachedOrders = loadCache<Order[]>('orders');
    const cachedActivities = loadCache<Activity[]>('activities');
    if (cachedOrders && cachedOrders.length > 0) setOrders(cachedOrders);
    if (cachedActivities && cachedActivities.length > 0) setActivities(cachedActivities);

    const fetchOrders = async () => {
      try {
        const [orderData, activityData] = await Promise.all([
          apiCall(`${API_URL}/api/orders`),
          apiCall(`${API_URL}/api/activities`),
        ]);

        if (orderData.success && Array.isArray(orderData.data)) {
          setOrders(orderData.data);
          saveCache('orders', orderData.data);
        }
        if (activityData.success && Array.isArray(activityData.data)) {
          setActivities(activityData.data);
          saveCache('activities', activityData.data);
        }
      } catch (err) {
        // Silent fail for polling - cached data already shown
        console.error('Polling failed:', err);
      }
    };

    fetchOrders();
    const id = setInterval(fetchOrders, 10_000);
    return () => clearInterval(id);
  }, []);

  // ── CRUD Helpers ──
  const updateResStatus = async (id: string, status: Reservation['status']) => {
    try {
      await apiCall(`${API_URL}/api/data/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setReservations(rs => rs.map(r => r.id === id ? { ...r, status } : r));
      showToast(`✓ Reservation ${status}`);
    } catch (err: any) {
      showToast(`✗ Failed to update reservation: ${err.message}`);
    }
  };

  const markRead = async (id: string) => {
    try {
      await apiCall(`${API_URL}/api/data/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'read' })
      });
      setContacts(cs => cs.map(c => c.id === id ? { ...c, status: 'read' } : c));
      showToast('✓ Message marked as read');
    } catch (err: any) {
      showToast(`✗ Failed to mark as read: ${err.message}`);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Delete this dish from the menu?')) return;

    try {
      await apiCall(`${API_URL}/api/data/menu/${id}`, { method: 'DELETE' });
      setMenuItems(ms => ms.filter(m => m.id !== id));
      if (editItem?.id === id) setEditItem(null);
      showToast('🗑 Dish removed from menu');
    } catch (err: any) {
      showToast(`✗ Failed to delete item: ${err.message}`);
    }
  };

  const toggleVisible = async (id: string) => {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;

    const newVis = !item.visible;
    try {
      await apiCall(`${API_URL}/api/data/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ visible: newVis })
      });
      setMenuItems(ms => ms.map(m => m.id === id ? { ...m, visible: newVis } : m));
      showToast(newVis ? '✓ Dish is now visible on website' : '⊘ Dish marked as unavailable');
    } catch (err: any) {
      showToast(`✗ Failed to update visibility: ${err.message}`);
    }
  };

  const addMenuItem = async () => {
    const newItem = { name: 'New Dish', category: 'Signature', price: 0, tag: '', emoji: '🍽', visible: true };

    try {
      const data = await apiCall(`${API_URL}/api/data/menu`, {
        method: 'POST',
        body: JSON.stringify(newItem)
      });

      const saved = { ...data.data, id: data.data._id };
      setMenuItems(ms => [...ms, saved]);
      setEditItem(saved);
      showToast('+ New dish created — edit below');
    } catch (err: any) {
      showToast(`✗ Failed to create dish: ${err.message}`);
    }
  };

  const saveHours = async () => {
    setSaving(true);
    try {
      await apiCall(`${API_URL}/api/data/settings/hours`, {
        method: 'PUT',
        body: JSON.stringify({ value: hours })
      });
      showToast('✓ Opening hours saved & live on website!');
    } catch (err: any) {
      showToast(`✗ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async () => {
    setSaving(true);
    try {
      await apiCall(`${API_URL}/api/data/settings/seo`, {
        method: 'PUT',
        body: JSON.stringify({ value: seo })
      });
      showToast('✓ SEO settings saved & live!');
    } catch (err: any) {
      showToast(`✗ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveDesign = async () => {
    setSaving(true);
    try {
      await apiCall(`${API_URL}/api/data/settings/design`, {
        method: 'PUT',
        body: JSON.stringify({ value: { color: designColor } })
      });
      document.documentElement.style.setProperty('--gold', designColor);
      showToast('✓ Design color saved & live on website!');
    } catch (err: any) {
      showToast(`✗ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Nav items ──
  const navItems: { key: Tab; icon: React.ElementType; label: string; badge?: number }[] = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'orders', icon: ShoppingCart, label: 'Orders', badge: pendingOrders.length || undefined },
    { key: 'menu', icon: UtensilsCrossed, label: 'Menu' },
    { key: 'reservations', icon: CalendarCheck, label: 'Reservations', badge: reservations.filter(r => r.status === 'pending').length || undefined },
    { key: 'contacts', icon: MessageSquare, label: 'Contacts', badge: contacts.filter(c => c.status === 'unread').length || undefined },
    { key: 'hours', icon: Clock, label: 'Hours' },
    { key: 'blog', icon: FileText, label: 'Blog' },
    { key: 'design', icon: Palette, label: 'Design' },
    { key: 'seo', icon: Settings, label: 'SEO' },
  ];

  // ── Sidebar ──
  const Sidebar = () => (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoGold}>✦</span>
          <div>
            <div className={styles.logoName}>Admin Panel</div>
            <div className={styles.logoSub}>Raj&apos;s Cafe</div>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map(({ key, icon: Icon, label, badge }) => (
            <button key={key} className={`${styles.navItem} ${tab === key ? styles.navActive : ''}`} onClick={() => setTab(key)}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {badge ? <span className={styles.navBadge}>{badge}</span> : null}
              <ChevronRight size={14} className={styles.navChev} />
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn}><LogOut size={15} strokeWidth={1.8} /> Sign Out</button>
          <a href="/" className={styles.viewSiteBtn} target="_blank" rel="noopener noreferrer"><Eye size={14} /> View Site</a>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className={styles.mobileTopBar}>
        <span className={styles.logoGold}>✦</span>
        <div style={{ flex: 1 }}>
          <div className={styles.logoName}>Admin Panel</div>
          <div className={styles.logoSub}>Raj&apos;s Cafe</div>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.mobileViewSite} title="View Site">
          <Eye size={16} />
        </a>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileBottomNav}>
        {navItems.map(({ key, icon: Icon, label, badge }) => (
          <button key={key} className={`${styles.mobileNavBtn} ${tab === key ? styles.mobileNavActive : ''}`} onClick={() => setTab(key)}>
            <div className={styles.mobileNavIconWrap}>
              <Icon size={20} strokeWidth={1.8} />
              {badge ? <span className={styles.mobileNavBadge}>{badge}</span> : null}
            </div>
            <span className={styles.mobileNavLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );

  // ── Dashboard ──
  const DashboardView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back. Here&apos;s your cafe at a glance.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.notifBtn}><Bell size={18} /></button>
          <a href="#reservation" className={styles.quickCta}>+ New Reservation</a>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: 'Total Orders', val: orders.length, icon: ShoppingCart, trend: `${confirmedOrders.length} completed`, color: 'var(--gold)' },
          { label: 'Pending Orders', val: pendingOrders.length, icon: Bell, trend: pendingOrders.length > 0 ? 'Needs Action' : 'All clear ✓', color: pendingOrders.length > 0 ? '#E09B3D' : '#5ABF78' },
          { label: 'Total Reservations', val: reservations.length, icon: CalendarCheck, trend: `${reservations.filter(r => r.status === 'pending').length} pending`, color: 'var(--gold)' },
          { label: "Today's Income", val: `₹${todayIncome.toLocaleString()}`, icon: TrendingUp, trend: 'Updated live', color: '#5ABF78' },
          { label: 'All-Time Income', val: `₹${totalIncome.toLocaleString()}`, icon: TrendingUp, trend: `from ${orders.length} orders`, color: '#5B9CF6' },
          { label: 'Unread Messages', val: contacts.filter(c => c.status === 'unread').length, icon: MessageSquare, trend: 'New', color: '#5B9CF6' },
        ].map(({ label, val, icon: Icon, trend, color }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon} style={{ color }}><Icon size={20} strokeWidth={1.5} /></div>
              <span className={styles.statTrend}>{trend}</span>
            </div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Live Website Activity</h2>
      <div className={styles.tableWrap} style={{ marginBottom: '2rem' }}>
        <table className={styles.table}>
          <thead><tr>
            {['Time', 'Type', 'Description', 'Visitor IP'].map(h => <th key={h} className={styles.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {activities.length > 0 ? activities.slice(0, 5).map(act => (
              <tr key={act._id} className={styles.tr}>
                <td className={styles.td}>{new Date(act.timestamp).toLocaleTimeString()}</td>
                <td className={styles.td}><span className={`${styles.statusBadge} ${styles.status_pending}`} style={{ textTransform: 'capitalize' }}>{act.type}</span></td>
                <td className={styles.td}>{act.description}</td>
                <td className={styles.td}><span className={styles.guestEmail}>{act.ipAddress}</span></td>
              </tr>
            )) : <tr><td colSpan={4} className={styles.td} style={{ textAlign: 'center' }}>No recent activity...</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className={styles.sectionTitle}>Recent Reservations</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr>{['Guest', 'Date', 'Time', 'Guests', 'Status', 'Actions'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {reservations.slice(0, 4).map(r => (
              <tr key={r.id} className={styles.tr}>
                <td className={styles.td}><div className={styles.guestName}>{r.name}</div><div className={styles.guestEmail}>{r.email}</div></td>
                <td className={styles.td}>{r.date}</td>
                <td className={styles.td}>{r.time}</td>
                <td className={styles.td}>{r.guests}</td>
                <td className={styles.td}><span className={`${styles.statusBadge} ${styles['status_' + r.status]}`}>{r.status}</span></td>
                <td className={styles.td}>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={styles.btnConfirm} onClick={() => updateResStatus(r.id, 'confirmed')}><Check size={13} /> Confirm</button>
                      <button className={styles.btnCancel} onClick={() => updateResStatus(r.id, 'cancelled')}><X size={13} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Menu Manager ──
  const MenuView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Menu Manager</h1>
          <p className={styles.pageSubtitle}>{menuItems.length} items · {menuItems.filter(m => m.visible).length} visible on site</p>
        </div>
        <button className={styles.primaryBtn} onClick={addMenuItem}><Plus size={16} /> Add Dish</button>
      </div>

      {editItem && (
        <div className={styles.editCard}>
          <h3 className={styles.editTitle}>✏ Edit: {editItem.name}</h3>
          <div className={styles.editGrid}>
            {([
              { label: 'Dish Name', key: 'name', type: 'text' },
              { label: 'Emoji', key: 'emoji', type: 'text' },
              { label: 'Price (₹)', key: 'price', type: 'number' },
              { label: 'Category', key: 'category', type: 'text' },
              { label: 'Tag/Badge', key: 'tag', type: 'text' },
            ] as { label: string; key: keyof MenuItem; type: string }[]).map(({ label, key, type }) => (
              <div key={key} className={styles.editField}>
                <label className={styles.editLabel}>{label}</label>
                <input className={styles.editInput} type={type}
                  value={editItem[key] as string}
                  onChange={e => setEditItem({ ...editItem, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                />
              </div>
            ))}
            <div className={styles.editField}>
              <label className={styles.editLabel}>Availability</label>
              <label className={styles.toggleWrap}>
                <input type="checkbox" checked={editItem.visible} onChange={() => setEditItem({ ...editItem, visible: !editItem.visible })} />
                <span className={styles.toggle} />
                <span className={styles.toggleLabel}>{editItem.visible ? '✓ Visible on menu' : '⊘ Hidden / Unavailable'}</span>
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className={styles.primaryBtn} onClick={async () => {
              try {
                await apiCall(`${API_URL}/api/data/menu/${editItem.id}`, {
                  method: 'PUT',
                  body: JSON.stringify(editItem),
                });
                setMenuItems(ms => ms.map(m => m.id === editItem.id ? editItem : m));
                setEditItem(null);
                showToast('✓ Dish saved & live on website!');
              } catch (err: any) {
                showToast(`✗ Save failed: ${err.message}`);
              }
            }}><Save size={14} /> Save Changes</button>
            <button className={styles.ghostBtn} onClick={() => setEditItem(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.menuGrid}>
        {menuItems.map(item => (
          <div key={item.id} className={`${styles.menuCard} ${!item.visible ? styles.menuCardHidden : ''}`}>
            <div className={styles.menuCardEmoji}>{item.emoji || '🍽'}</div>
            <div className={styles.menuCardBody}>
              <div className={styles.menuCardName}>{item.name}</div>
              <div className={styles.menuCardMeta}>{item.category} · ₹{item.price}</div>
              {item.tag && <span className={styles.menuCardTag}>{item.tag}</span>}
              {!item.visible && <span className={styles.unavailableBadge}>⊘ Unavailable</span>}
            </div>
            <div className={styles.menuCardActions}>
              <button className={styles.iconBtn} onClick={() => setEditItem(item)} title="Edit"><Edit size={14} /></button>
              <button className={styles.iconBtn} onClick={() => toggleVisible(item.id)} title={item.visible ? 'Mark Unavailable' : 'Make Available'}>
                {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => deleteMenuItem(item.id)} title="Delete"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {menuItems.length === 0 && (
          <p className={styles.pageSubtitle} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
            No menu items yet. Click &ldquo;Add Dish&rdquo; to create your first item.
          </p>
        )}
      </div>
    </div>
  );

  // ── Reservations ──
  const ReservationsView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reservations</h1>
          <p className={styles.pageSubtitle}>{reservations.filter(r => r.status === 'pending').length} pending confirmations</p>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr>{['Guest', 'Contact', 'Date & Time', 'Guests', 'Occasion', 'Status', 'Actions'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id} className={styles.tr}>
                <td className={styles.td}><div className={styles.guestName}>{r.name}</div></td>
                <td className={styles.td}><div className={styles.guestEmail}>{r.email}</div><div className={styles.guestEmail}>{r.phone}</div></td>
                <td className={styles.td}>{r.date} · {r.time}</td>
                <td className={styles.td}>{r.guests}</td>
                <td className={styles.td}>{r.occasion || '—'}</td>
                <td className={styles.td}><span className={`${styles.statusBadge} ${styles['status_' + r.status]}`}>{r.status}</span></td>
                <td className={styles.td}>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className={styles.btnConfirm} onClick={() => updateResStatus(r.id, 'confirmed')}><Check size={13} /> Confirm</button>
                      <button className={styles.btnCancel} onClick={() => updateResStatus(r.id, 'cancelled')}><X size={13} /></button>
                    </div>
                  )}
                  {r.status !== 'pending' && <span className={styles.guestEmail}>No actions</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Contacts ──
  const ContactsView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Contact Submissions</h1>
          <p className={styles.pageSubtitle}>{contacts.filter(c => c.status === 'unread').length} unread messages</p>
        </div>
      </div>
      <div className={styles.contactList}>
        {contacts.map(c => (
          <div key={c.id} className={`${styles.contactCard} ${c.status === 'unread' ? styles.contactUnread : ''}`}>
            <div className={styles.contactTop}>
              <div>
                <span className={styles.guestName}>{c.name}</span>
                <span className={styles.guestEmail}> · {c.email} · {c.createdAt}</span>
              </div>
              {c.status === 'unread' && <span className={styles.unreadDot} />}
            </div>
            <div className={styles.contactSubject}>{c.subject}</div>
            <p className={styles.contactMsg}>{c.message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <a href={`mailto:${c.email}`} className={styles.primaryBtn} style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>Reply via Email</a>
              {c.status === 'unread' && <button className={styles.ghostBtn} style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }} onClick={() => markRead(c.id)}>Mark as Read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Opening Hours ──
  const HoursView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Opening Hours</h1>
          <p className={styles.pageSubtitle}>Changes go live on your website immediately after saving</p>
        </div>
        <button className={styles.primaryBtn} onClick={saveHours} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving…' : 'Save & Go Live'}
        </button>
      </div>
      <div className={styles.editCard}>
        {hours.map((h, i) => (
          <div key={h.day} className={styles.hourRow}>
            <span className={styles.hourDay}>{h.day}</span>
            <label className={styles.toggleWrap}>
              <input type="checkbox" checked={!h.closed} onChange={() => setHours(hs => hs.map((x, j) => j === i ? { ...x, closed: !x.closed } : x))} />
              <span className={styles.toggle} />
              <span className={styles.toggleLabel}>{h.closed ? 'Closed' : 'Open'}</span>
            </label>
            {!h.closed && (
              <>
                <input type="time" className={styles.editInput} style={{ width: '130px' }} value={h.open} onChange={e => setHours(hs => hs.map((x, j) => j === i ? { ...x, open: e.target.value } : x))} />
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>to</span>
                <input type="time" className={styles.editInput} style={{ width: '130px' }} value={h.close} onChange={e => setHours(hs => hs.map((x, j) => j === i ? { ...x, close: e.target.value } : x))} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Blog & Events ──
  const BlogView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog & Events</h1>
          <p className={styles.pageSubtitle}>{posts.filter(p => p.status === 'published').length} published · {posts.filter(p => p.status === 'draft').length} drafts</p>
        </div>
        <button className={styles.primaryBtn} onClick={async () => {
          const np = { title: 'New Post', excerpt: '', status: 'draft', date: new Date().toISOString().split('T')[0] };
          const res = await fetch(`${API_URL}/api/data/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(np) });
          const data = await res.json();
          if (data.success) { const saved = { ...data.data, id: data.data._id }; setPosts(ps => [...ps, saved]); setEditPost(saved); showToast('+ New post created'); }
        }}><Plus size={16} /> New Post</button>
      </div>

      {editPost && (
        <div className={styles.editCard}>
          <h3 className={styles.editTitle}>Edit Post</h3>
          <div className={styles.editGrid}>
            <div className={styles.editField} style={{ gridColumn: '1/-1' }}>
              <label className={styles.editLabel}>Title</label>
              <input className={styles.editInput} value={editPost.title} onChange={e => setEditPost({ ...editPost, title: e.target.value })} />
            </div>
            <div className={styles.editField} style={{ gridColumn: '1/-1' }}>
              <label className={styles.editLabel}>Excerpt / Content</label>
              <textarea className={styles.editInput} style={{ minHeight: '100px', resize: 'vertical' }} value={editPost.excerpt} onChange={e => setEditPost({ ...editPost, excerpt: e.target.value })} />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Status</label>
              <select className={styles.editInput} value={editPost.status} onChange={e => setEditPost({ ...editPost, status: e.target.value as 'draft' | 'published' })}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published — Live on Website</option>
              </select>
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Date</label>
              <input type="date" className={styles.editInput} value={editPost.date} onChange={e => setEditPost({ ...editPost, date: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className={styles.primaryBtn} onClick={async () => {
              const res = await fetch(`${API_URL}/api/data/posts/${editPost.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editPost) });
              const data = await res.json();
              if (data.success) { setPosts(ps => ps.map(p => p.id === editPost.id ? editPost : p)); setEditPost(null); showToast('✓ Post saved!' + (editPost.status === 'published' ? ' Now live on website!' : ' (Draft)')); }
            }}><Save size={14} /> Save Post</button>
            <button className={styles.ghostBtn} onClick={() => setEditPost(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.blogList}>
        {posts.map(p => (
          <div key={p.id} className={styles.blogItem}>
            <div className={styles.blogInfo}>
              <span className={`${styles.statusBadge} ${p.status === 'published' ? styles.status_confirmed : styles.status_pending}`}>{p.status}</span>
              <h3 className={styles.blogTitle}>{p.title}</h3>
              <p className={styles.blogExcerpt}>{p.excerpt}</p>
              <span className={styles.guestEmail}>{p.date}</span>
            </div>
            <div className={styles.menuCardActions}>
              <button className={styles.iconBtn} onClick={() => setEditPost(p)}><Edit size={14} /></button>
              <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={async () => {
                if (!confirm('Delete this post?')) return;
                await fetch(`${API_URL}/api/data/posts/${p.id}`, { method: 'DELETE' });
                setPosts(ps => ps.filter(x => x.id !== p.id));
                showToast('🗑 Post deleted');
              }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className={styles.pageSubtitle} style={{ textAlign: 'center', padding: '2rem' }}>No posts yet. Click &ldquo;New Post&rdquo; to get started.</p>}
      </div>
    </div>
  );

  // ── Design Controls ──
  const DesignView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Design Controls</h1>
          <p className={styles.pageSubtitle}>Customize your site&apos;s visual identity — changes go live on website after saving</p>
        </div>
      </div>
      <div className={styles.designGrid}>
        <div className={styles.designCard}>
          <h3 className={styles.editTitle}>Primary Accent Color</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
            <input type="color" value={designColor} onChange={e => setDesignColor(e.target.value)} className={styles.colorPicker} />
            <span className={styles.guestEmail}>{designColor}</span>
          </div>
          <div className={styles.colorSwatches}>
            {['#C9A84C', '#D4AF37', '#B8860B', '#8B6914', '#CD853F', '#DAA520'].map(c => (
              <button key={c} className={`${styles.swatch} ${designColor === c ? styles.swatchActive : ''}`} style={{ background: c }} onClick={() => setDesignColor(c)} />
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className={styles.primaryBtn} onClick={saveDesign} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Apply & Save to Website'}
            </button>
            <button className={styles.ghostBtn} onClick={() => document.documentElement.style.setProperty('--gold', designColor)}>Preview Only</button>
          </div>
        </div>
        <div className={styles.designCard}>
          <h3 className={styles.editTitle}>Typography</h3>
          <p className={styles.pageSubtitle} style={{ marginTop: '0.75rem' }}>Display: Playfair Display</p>
          <p className={styles.pageSubtitle}>Body: Cormorant Garamond</p>
          <p className={styles.pageSubtitle}>UI: DM Sans</p>
          <div className={styles.fontPreview}>The Quick Brown Fox</div>
        </div>
        <div className={styles.designCard}>
          <h3 className={styles.editTitle}>Media Library</h3>
          <p className={styles.pageSubtitle} style={{ marginTop: '0.75rem' }}>Upload and manage site images</p>
          <div className={styles.uploadArea}>
            <ImageIcon size={32} className={styles.uploadIcon} />
            <span className={styles.uploadText}>Drag & drop images here<br />or click to upload</span>
            <input type="file" accept="image/*" multiple className={styles.fileInput} />
          </div>
        </div>
      </div>
    </div>
  );

  // ── SEO Settings ──
  const SEOView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>SEO Settings</h1>
          <p className={styles.pageSubtitle}>Meta tags saved directly to your website</p>
        </div>
        <button className={styles.primaryBtn} onClick={saveSeo} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving…' : 'Save & Go Live'}
        </button>
      </div>
      <div className={styles.editCard}>
        <div className={styles.editGrid}>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Page Title</label>
            <input className={styles.editInput} value={seo.title} onChange={e => setSeo({ ...seo, title: e.target.value })} placeholder="Raj's Cafe — Luxury Dining" />
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Focus Keywords</label>
            <input className={styles.editInput} value={seo.keywords} onChange={e => setSeo({ ...seo, keywords: e.target.value })} placeholder="cafe, luxury, dining, artisan coffee" />
          </div>
          <div className={styles.editField} style={{ gridColumn: '1/-1' }}>
            <label className={styles.editLabel}>Meta Description</label>
            <textarea className={styles.editInput} style={{ minHeight: '80px', resize: 'vertical' }} value={seo.description} onChange={e => setSeo({ ...seo, description: e.target.value })} placeholder="Describe your cafe for Google..." />
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>OG Image URL</label>
            <input className={styles.editInput} value={seo.ogImage} onChange={e => setSeo({ ...seo, ogImage: e.target.value })} placeholder="/hero-dish.png" />
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Google Analytics ID</label>
            <input className={styles.editInput} value={seo.gaId} onChange={e => setSeo({ ...seo, gaId: e.target.value })} placeholder="G-XXXXXXXXXX" />
          </div>
          <div className={styles.editField} style={{ gridColumn: '1/-1' }}>
            <label className={styles.editLabel}>Site Verification Tag</label>
            <input className={styles.editInput} value={seo.verification} onChange={e => setSeo({ ...seo, verification: e.target.value })} placeholder="Google Search Console verification code" />
          </div>
        </div>
      </div>
    </div>
  );

  // ── Orders ──
  const NoteInput = ({ order, onSend }: { order: any; onSend: (note: string) => void }) => {
    const [note, setNote] = useState(order.adminMessage || '');
    return (
      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
        <input
          className={styles.editInput}
          style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem', flex: 1, minWidth: 0 }}
          placeholder="Note to customer…"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button
          className={styles.btnConfirm}
          style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem', whiteSpace: 'nowrap' }}
          onClick={() => onSend(note)}
          disabled={!note.trim()}
        >Send</button>
      </div>
    );
  };

  const OrdersView = () => {
    const updateOrderStatus = async (id: string, newStatus: string) => {
      let message = '';
      if (newStatus === 'Cancelled') {
        const input = prompt('Reason for cancellation (optional):');
        if (input === null) return;
        message = input;
      }
      try {
        const res = await fetch(`${API_URL}/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus, adminMessage: message }) });
        const data = await res.json();
        if (data.success) { setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus, adminMessage: message || o.adminMessage } : o)); showToast(`✓ Order ${newStatus}`); }
      } catch { console.error('Failed to update order'); }
    };

    return (
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Orders</h1>
            <p className={styles.pageSubtitle}>{orders.filter(o => o.status === 'Pending').length} pending orders</p>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>{['Customer', 'Items', 'Amount', 'Info', 'Status', 'Actions'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className={styles.tr}>
                  <td className={styles.td}><div className={styles.guestName}>{o.customerName || 'Guest'}</div><div className={styles.guestEmail}>{o.customerPhone || o.customerEmail}</div></td>
                  <td className={styles.td}><div className={styles.guestEmail} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div></td>
                  <td className={styles.td}>₹{o.totalAmount}</td>
                  <td className={styles.td}><div className={styles.guestEmail}>{o.paymentMethod || 'Paid'}</div><div className={styles.guestEmail}>{new Date(o.createdAt).toLocaleTimeString()}</div></td>
                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${o.status === 'Completed' ? styles.status_confirmed :
                        o.status === 'Cancelled' ? styles.status_cancelled :
                          o.status === 'Preparing' ? styles.status_confirmed :
                            o.status === 'Ready' ? styles.status_confirmed :
                              styles.status_pending
                      }`}>{o.status}</span>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {o.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button className={styles.btnConfirm} onClick={() => updateOrderStatus(o._id, 'Preparing')}><Check size={13} /> Accept</button>
                          <button className={styles.btnCancel} onClick={() => updateOrderStatus(o._id, 'Cancelled')}><X size={13} /></button>
                        </div>
                      )}
                      {o.status === 'Preparing' && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button className={styles.btnConfirm} onClick={() => updateOrderStatus(o._id, 'Completed')}><Check size={13} /> Complete</button>
                          <button className={styles.btnCancel} onClick={() => updateOrderStatus(o._id, 'Cancelled')}><X size={13} /></button>
                        </div>
                      )}
                      {(o.status === 'Pending' || o.status === 'Preparing') && (
                        <NoteInput order={o} onSend={(note) => {
                          fetch(`${API_URL}/api/orders/${o._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: o.status, adminMessage: note }) })
                            .then(r => r.json())
                            .then(d => { if (d.success) { setOrders(orders.map(x => x._id === o._id ? { ...x, adminMessage: note } : x)); showToast('✓ Note sent to customer'); } });
                        }} />
                      )}
                      {o.adminMessage && o.status !== 'Cancelled' && <span className={styles.guestEmail} style={{ fontStyle: 'italic' }}>📝 {o.adminMessage}</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const viewMap: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardView />,
    orders: <OrdersView />,
    menu: <MenuView />,
    reservations: <ReservationsView />,
    contacts: <ContactsView />,
    hours: <HoursView />,
    blog: <BlogView />,
    design: <DesignView />,
    seo: <SEOView />,
  };

  // Loading state — only show spinner if we have absolutely no cached data
  const hasCachedData = orders.length > 0 || menuItems.length > 0 || reservations.length > 0;
  if (loading && !hasCachedData) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.mainArea}>
          <div className={styles.content}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid var(--border)',
                borderTop: '3px solid var(--gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
                Connecting to backend...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainArea}>
        {/* Connection error banner — shows on top without hiding content */}
        {connectionError && (
          <div style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#FCA5A5',
            padding: '0.65rem 1.25rem',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}>
            <span>⚠ {connectionError}</span>
            <button style={{ background: 'none', border: 'none', color: '#FCA5A5', cursor: 'pointer', fontSize: '1rem' }} onClick={() => setConnectionError('')}>✕</button>
          </div>
        )}
        {viewMap[tab]}
      </div>
      {/* Toast Notification */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
