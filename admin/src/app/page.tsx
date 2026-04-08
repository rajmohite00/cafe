'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, UtensilsCrossed, CalendarCheck, MessageSquare,
  Clock, Settings, Image as ImageIcon, Palette, FileText,
  TrendingUp, Users, Star, Plus, Trash2, Edit, Eye, Check, X,
  ChevronRight, LogOut, Bell, ShoppingCart
} from 'lucide-react';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '${API_URL}';

// ── Types ──
type Tab = 'dashboard' | 'orders' | 'menu' | 'reservations' | 'contacts' | 'hours' | 'seo' | 'design' | 'blog';

type MenuItem = { id: number; name: string; category: string; price: number; tag: string; emoji: string; visible: boolean; };
type Reservation = { id: string; name: string; date: string; time: string; guests: number; email: string; phone: string; status: 'pending'|'confirmed'|'cancelled'; occasion?: string; };
type Contact = { id: string; name: string; email: string; subject: string; message: string; status: 'unread'|'read'; createdAt: string; };
type BlogPost = { id: number; title: string; excerpt: string; status: 'draft'|'published'; date: string; };
type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  paymentMethod?: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  adminMessage?: string;
  createdAt: string;
};
type Activity = {
  _id: string;
  type: string;
  description: string;
  timestamp: string;
  ipAddress: string;
};

// ── Seed data ──
const seedMenu: MenuItem[] = [
  { id:1, name:"Raj's Golden Toast",    category:'Signature', price:495, tag:'Bestseller',   emoji:'🍞', visible:true },
  { id:2, name:"Saffron Latte",         category:'Coffee',    price:345, tag:'Award-Winning', emoji:'☕', visible:true },
  { id:3, name:"Heritage Shakshuka",    category:'Signature', price:550, tag:"Chef's Pick",  emoji:'🍳', visible:true },
  { id:4, name:"Full Raj Breakfast",    category:'Breakfast', price:795, tag:'',              emoji:'🍽', visible:true },
  { id:5, name:"Dark Chocolate Fondant",category:'Desserts',  price:545, tag:'Must Try',     emoji:'🍫', visible:true },
  { id:6, name:"Cold Brew Reserve",     category:'Coffee',    price:325, tag:'Signature',    emoji:'🧊', visible:true },
];

const seedReservations: Reservation[] = [
  { id:'r1', name:'Priya Mehra',    date:'2026-04-05', time:'19:00', guests:2, email:'priya@email.com',  phone:'+91 9876543210', status:'confirmed', occasion:'Anniversary' },
  { id:'r2', name:'James Thornton', date:'2026-04-06', time:'13:00', guests:4, email:'james@email.com',  phone:'+91 9999988888', status:'pending'   },
  { id:'r3', name:'Ananya Krishnan',date:'2026-04-06', time:'20:00', guests:6, email:'ananya@email.com', phone:'+91 9123456789', status:'pending',   occasion:'Birthday'  },
  { id:'r4', name:'Rohan Verma',    date:'2026-04-07', time:'09:00', guests:1, email:'rohan@email.com',  phone:'+91 9000000001', status:'cancelled'  },
];

const seedContacts: Contact[] = [
  { id:'c1', name:'Sophie Laurent', email:'sophie@email.fr', subject:'Private Event Inquiry', message:'Hello, I\'d like to inquire about hosting a corporate dinner for 25 guests next month. Please share availability and menu options.', status:'unread', createdAt:'2026-03-30' },
  { id:'c2', name:'Vikram Singh',   email:'vikram@email.in', subject:'Catering Partnership', message:'We are planning a corporate event and would love Raj\'s Cafe to cater. Could you send over your catering packages?', status:'read', createdAt:'2026-03-29' },
];

const seedPosts: BlogPost[] = [
  { id:1, title:'Spring Menu Launch 2026', excerpt:'Discover our vibrant seasonal specials featuring locally sourced spring produce and new artisan coffee blends.', status:'published', date:'2026-03-15' },
  { id:2, title:'Chef Raj Wins Top Cafe Award', excerpt:'We are thrilled to announce that Raj\'s Cafe has been awarded Best Luxury Cafe in Delhi for the third consecutive year.', status:'published', date:'2026-03-01' },
  { id:3, title:'Upcoming Easter Brunch Event', excerpt:'Join us for an exclusive Easter Sunday brunch with live music, a champagne station, and a special kids\' activity corner.', status:'draft', date:'2026-04-01' },
];



// ── Component ──
export default function AdminPage() {
  const [tab,          setTab]          = useState<Tab>('dashboard');
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [menuItems,    setMenuItems]    = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contacts,     setContacts]     = useState<Contact[]>([]);
  const [posts,        setPosts]        = useState<BlogPost[]>([]);
  const [editItem,     setEditItem]     = useState<MenuItem|null>(null);
  const [editPost,     setEditPost]     = useState<BlogPost|null>(null);
  const [designColor,  setDesignColor]  = useState('#C9A84C');
  const [activities,   setActivities]   = useState<Activity[]>([]);

  const totalRevenue = reservations.filter(r => r.status !== 'cancelled').reduce((a,r) => a + r.guests * 1200, 0);

  useEffect(() => {
    // Initial fetch for everything else
    const fetchAllData = async () => {
      try {
        const [menuRes, resRes, contactRes, postRes] = await Promise.all([
          fetch('${API_URL}/api/data/menu'),
          fetch('${API_URL}/api/data/reservations'),
          fetch('${API_URL}/api/data/contacts'),
          fetch('${API_URL}/api/data/posts')
        ]);
        const [menu, res, contacts, posts] = await Promise.all([
          menuRes.json(), resRes.json(), contactRes.json(), postRes.json()
        ]);
        if (menu.success) setMenuItems(menu.data.map((d: any) => ({ ...d, id: d._id })));
        if (res.success) setReservations(res.data.map((d: any) => ({ ...d, id: d._id })));
        if (contacts.success) setContacts(contacts.data.map((d: any) => ({ ...d, id: d._id })));
        if (posts.success) setPosts(posts.data.map((d: any) => ({ ...d, id: d._id })));
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('${API_URL}/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }

      try {
        const resAct = await fetch('${API_URL}/api/activities');
        const dataAct = await resAct.json();
        if (dataAct.success) {
          setActivities(dataAct.data);
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // reduced to 3s for better real-time feel
    return () => clearInterval(interval);
  }, []);


  // ── Helpers ──
  const updateResStatus = async (id: string, status: Reservation['status']) => {
    await fetch(`${API_URL}/api/data/reservations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setReservations(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };
  const markRead = async (id: string) => {
    await fetch(`${API_URL}/api/data/contacts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'read' }) });
    setContacts(cs => cs.map(c => c.id === id ? { ...c, status: 'read' } : c));
  };
  const deleteMenuItem = async (id: number) => {
    await fetch(`${API_URL}/api/data/menu/${id}`, { method: 'DELETE' });
    setMenuItems(ms => ms.filter(m => m.id !== id));
  };
  const toggleVisible = async (id: number) => {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    await fetch(`${API_URL}/api/data/menu/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !item.visible }) });
    setMenuItems(ms => ms.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  };
  const addMenuItem = async () => {
    const newItem = { name:'New Dish', category:'Signature', price:0, tag:'', emoji:'🍽', visible:true };
    const res = await fetch('${API_URL}/api/data/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    const data = await res.json();
    if (data.success) {
      const saved = { ...data.data, id: data.data._id };
      setMenuItems(ms => [...ms, saved]);
      setEditItem(saved);
    }
  };

  const navItems: { key: Tab; icon: React.ElementType; label: string; badge?: number }[] = [
    { key:'dashboard',    icon:LayoutDashboard, label:'Dashboard'             },
    { key:'orders',       icon:ShoppingCart,    label:'Orders',       badge: orders.filter(o=>o.status==='Pending').length },
    { key:'menu',         icon:UtensilsCrossed, label:'Menu Manager'           },
    { key:'reservations', icon:CalendarCheck,   label:'Reservations', badge: reservations.filter(r=>r.status==='pending').length },
    { key:'contacts',     icon:MessageSquare,   label:'Contacts',     badge: contacts.filter(c=>c.status==='unread').length       },
    { key:'hours',        icon:Clock,           label:'Opening Hours'          },
    { key:'blog',         icon:FileText,        label:'Blog & Events'          },
    { key:'design',       icon:Palette,         label:'Design'                 },
    { key:'seo',          icon:Settings,        label:'SEO Settings'           },
  ];

  // ── Sidebar ──
  const Sidebar = () => (
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
          <button
            key={key}
            className={`${styles.navItem} ${tab === key ? styles.navActive : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {badge ? <span className={styles.navBadge}>{badge}</span> : null}
            <ChevronRight size={14} className={styles.navChev} />
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn}>
          <LogOut size={15} strokeWidth={1.8} /> Sign Out
        </button>
        <a href="/" className={styles.viewSiteBtn} target="_blank" rel="noopener noreferrer">
          <Eye size={14} /> View Site
        </a>
      </div>
    </aside>
  );

  // ── Dashboard Tab ──
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

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {[
          { label:'Total Reservations', val:reservations.length,                              icon:CalendarCheck, trend:'+12%', color:'var(--gold)' },
          { label:'Pending Confirmations', val:reservations.filter(r=>r.status==='pending').length, icon:Bell,    trend:'Needs Action', color:'#E09B3D' },
          { label:'Revenue (Est.)', val:`₹${totalRevenue.toLocaleString()}`,               icon:TrendingUp,  trend:'+8% vs last month', color:'#5ABF78' },
          { label:'Unread Messages', val:contacts.filter(c=>c.status==='unread').length,        icon:MessageSquare, trend:'New', color:'#5B9CF6' },
          { label:'Menu Items', val:menuItems.length,                                           icon:UtensilsCrossed, trend:`${menuItems.filter(m=>m.visible).length} visible`, color:'var(--gold)' },
          { label:'Avg. Rating', val:'4.9 ★',                                                  icon:Star,        trend:'2,400+ reviews', color:'var(--gold)' },
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

      {/* Real-time Activities */}
      <h2 className={styles.sectionTitle}>Live Website Activity</h2>
      <div className={styles.tableWrap} style={{ marginBottom: '2rem' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Visitor IP</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? activities.slice(0, 5).map(act => (
              <tr key={act._id} className={styles.tr}>
                <td className={styles.td}>{new Date(act.timestamp).toLocaleTimeString()}</td>
                <td className={styles.td}>
                  <span className={`${styles.statusBadge} ${styles['status_pending']}`} style={{ textTransform: 'capitalize' }}>
                    {act.type}
                  </span>
                </td>
                <td className={styles.td}>{act.description}</td>
                <td className={styles.td}><span className={styles.guestEmail}>{act.ipAddress}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={4} className={styles.td} style={{ textAlign:'center' }}>No recent activity...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent reservations */}
      <h2 className={styles.sectionTitle}>Recent Reservations</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['Guest','Date','Time','Guests','Status','Actions'].map(h => (
                <th key={h} className={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.slice(0,4).map(r => (
              <tr key={r.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.guestName}>{r.name}</div>
                  <div className={styles.guestEmail}>{r.email}</div>
                </td>
                <td className={styles.td}>{r.date}</td>
                <td className={styles.td}>{r.time}</td>
                <td className={styles.td}>{r.guests}</td>
                <td className={styles.td}>
                  <span className={`${styles.statusBadge} ${styles['status_'+r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className={styles.td}>
                  {r.status === 'pending' && (
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button className={styles.btnConfirm} onClick={() => updateResStatus(r.id,'confirmed')}><Check size={13}/> Confirm</button>
                      <button className={styles.btnCancel} onClick={() => updateResStatus(r.id,'cancelled')}><X size={13}/></button>
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
          <p className={styles.pageSubtitle}>{menuItems.length} items · {menuItems.filter(m=>m.visible).length} visible on site</p>
        </div>
        <button className={styles.primaryBtn} onClick={addMenuItem}><Plus size={16}/> Add Item</button>
      </div>

      {editItem && (
        <div className={styles.editCard}>
          <h3 className={styles.editTitle}>Edit: {editItem.name}</h3>
          <div className={styles.editGrid}>
            {[
              { label:'Name',     key:'name',     type:'text'   },
              { label:'Emoji',    key:'emoji',    type:'text'   },
              { label:'Price (₹)',key:'price',    type:'number' },
              { label:'Category', key:'category', type:'text'   },
              { label:'Tag',      key:'tag',      type:'text'   },
            ].map(({ label, key, type }) => (
              <div key={key} className={styles.editField}>
                <label className={styles.editLabel}>{label}</label>
                <input
                  className={styles.editInput}
                  type={type}
                  value={(editItem as Record<string,string|number|boolean>)[key] as string}
                  onChange={e => setEditItem({ ...editItem, [key]: type==='number' ? Number(e.target.value) : e.target.value })}
                />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
            <button className={styles.primaryBtn} onClick={async () => {
              const res = await fetch(`${API_URL}/api/data/menu/${editItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editItem)
              });
              const data = await res.json();
              if (data.success) {
                setMenuItems(ms => ms.map(m => m.id === editItem.id ? editItem : m));
                setEditItem(null);
              }
            }}>Save Changes</button>
            <button className={styles.ghostBtn} onClick={() => setEditItem(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.menuGrid}>
        {menuItems.map(item => (
          <div key={item.id} className={`${styles.menuCard} ${!item.visible ? styles.menuCardHidden : ''}`}>
            <div className={styles.menuCardEmoji}>{item.emoji}</div>
            <div className={styles.menuCardBody}>
              <div className={styles.menuCardName}>{item.name}</div>
              <div className={styles.menuCardMeta}>{item.category} · ₹{item.price}</div>
              {item.tag && <span className={styles.menuCardTag}>{item.tag}</span>}
            </div>
            <div className={styles.menuCardActions}>
              <button className={styles.iconBtn} onClick={() => setEditItem(item)} title="Edit"><Edit size={14}/></button>
              <button className={styles.iconBtn} onClick={() => toggleVisible(item.id)} title={item.visible?'Hide':'Show'}><Eye size={14}/></button>
              <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => deleteMenuItem(item.id)} title="Delete"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Reservations ──
  const ReservationsView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reservations</h1>
          <p className={styles.pageSubtitle}>{reservations.filter(r=>r.status==='pending').length} pending confirmations</p>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr>{['Guest','Contact','Date & Time','Guests','Occasion','Status','Actions'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.guestName}>{r.name}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.guestEmail}>{r.email}</div>
                  <div className={styles.guestEmail}>{r.phone}</div>
                </td>
                <td className={styles.td}>{r.date} · {r.time}</td>
                <td className={styles.td}>{r.guests}</td>
                <td className={styles.td}>{r.occasion || '—'}</td>
                <td className={styles.td}><span className={`${styles.statusBadge} ${styles['status_'+r.status]}`}>{r.status}</span></td>
                <td className={styles.td}>
                  {r.status === 'pending' && (
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button className={styles.btnConfirm} onClick={() => updateResStatus(r.id,'confirmed')}><Check size={13}/> Confirm</button>
                      <button className={styles.btnCancel} onClick={() => updateResStatus(r.id,'cancelled')}><X size={13}/></button>
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
          <p className={styles.pageSubtitle}>{contacts.filter(c=>c.status==='unread').length} unread messages</p>
        </div>
      </div>
      <div className={styles.contactList}>
        {contacts.map(c => (
          <div key={c.id} className={`${styles.contactCard} ${c.status==='unread' ? styles.contactUnread : ''}`}>
            <div className={styles.contactTop}>
              <div>
                <span className={styles.guestName}>{c.name}</span>
                <span className={styles.guestEmail}> · {c.email} · {c.createdAt}</span>
              </div>
              {c.status === 'unread' && <span className={styles.unreadDot} />}
            </div>
            <div className={styles.contactSubject}>{c.subject}</div>
            <p className={styles.contactMsg}>{c.message}</p>
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.75rem' }}>
              <a href={`mailto:${c.email}`} className={styles.primaryBtn} style={{ padding:'0.5rem 1rem', fontSize:'0.78rem' }}>Reply via Email</a>
              {c.status==='unread' && <button className={styles.ghostBtn} style={{ padding:'0.5rem 1rem', fontSize:'0.78rem' }} onClick={() => markRead(c.id)}>Mark as Read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Opening Hours ──
  const HoursView = () => {
    const [hours, setHours] = useState([
      { day:'Monday – Friday', open:'08:00', close:'22:00', closed:false },
      { day:'Saturday',        open:'07:00', close:'23:00', closed:false },
      { day:'Sunday',          open:'07:00', close:'23:00', closed:false },
      { day:'Public Holidays', open:'08:00', close:'20:00', closed:false },
    ]);

    return (
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div><h1 className={styles.pageTitle}>Opening Hours</h1><p className={styles.pageSubtitle}>Manage your operating schedule</p></div>
          <button className={styles.primaryBtn}><Check size={15}/> Save Changes</button>
        </div>
        <div className={styles.editCard}>
          {hours.map((h, i) => (
            <div key={h.day} className={styles.hourRow}>
              <span className={styles.hourDay}>{h.day}</span>
              <label className={styles.toggleWrap}>
                <input type="checkbox" checked={!h.closed} onChange={() => setHours(hs => hs.map((x,j) => j===i ? {...x, closed:!x.closed} : x))} />
                <span className={styles.toggle} />
                <span className={styles.toggleLabel}>{h.closed ? 'Closed' : 'Open'}</span>
              </label>
              {!h.closed && (
                <>
                  <input type="time" className={styles.editInput} style={{ width:'130px' }} value={h.open}  onChange={e => setHours(hs => hs.map((x,j) => j===i ? {...x, open:e.target.value} : x))} />
                  <span style={{ color:'var(--muted)', fontSize:'0.85rem' }}>to</span>
                  <input type="time" className={styles.editInput} style={{ width:'130px' }} value={h.close} onChange={e => setHours(hs => hs.map((x,j) => j===i ? {...x, close:e.target.value} : x))} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Blog ──
  const BlogView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <div><h1 className={styles.pageTitle}>Blog & Events</h1><p className={styles.pageSubtitle}>{posts.filter(p=>p.status==='published').length} published · {posts.filter(p=>p.status==='draft').length} drafts</p></div>
        <button className={styles.primaryBtn} onClick={async () => { 
          const np = { title:'New Post', excerpt:'', status:'draft', date:new Date().toISOString().split('T')[0] }; 
          const res = await fetch('${API_URL}/api/data/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(np)
          });
          const data = await res.json();
          if (data.success) {
            const saved = { ...data.data, id: data.data._id };
            setPosts(ps => [...ps, saved]); 
            setEditPost(saved); 
          }
        }}><Plus size={16}/> New Post</button>
      </div>

      {editPost && (
        <div className={styles.editCard}>
          <h3 className={styles.editTitle}>Edit Post</h3>
          <div className={styles.editGrid}>
            <div className={styles.editField} style={{ gridColumn:'1/-1' }}>
              <label className={styles.editLabel}>Title</label>
              <input className={styles.editInput} value={editPost.title} onChange={e => setEditPost({...editPost, title:e.target.value})} />
            </div>
            <div className={styles.editField} style={{ gridColumn:'1/-1' }}>
              <label className={styles.editLabel}>Excerpt</label>
              <textarea className={styles.editInput} style={{ minHeight:'100px', resize:'vertical' }} value={editPost.excerpt} onChange={e => setEditPost({...editPost, excerpt:e.target.value})} />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Status</label>
              <select className={styles.editInput} value={editPost.status} onChange={e => setEditPost({...editPost, status:e.target.value as 'draft'|'published'})}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Date</label>
              <input type="date" className={styles.editInput} value={editPost.date} onChange={e => setEditPost({...editPost, date:e.target.value})} />
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
            <button className={styles.primaryBtn} onClick={async () => { 
              const res = await fetch(`${API_URL}/api/data/posts/${editPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editPost)
              });
              const data = await res.json();
              if (data.success) {
                setPosts(ps => ps.map(p=>p.id===editPost.id?editPost:p)); 
                setEditPost(null); 
              }
            }}>Save Post</button>
            <button className={styles.ghostBtn} onClick={() => setEditPost(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.blogList}>
        {posts.map(p => (
          <div key={p.id} className={styles.blogItem}>
            <div className={styles.blogInfo}>
              <span className={`${styles.statusBadge} ${p.status==='published'?styles.status_confirmed:styles.status_pending}`}>{p.status}</span>
              <h3 className={styles.blogTitle}>{p.title}</h3>
              <p className={styles.blogExcerpt}>{p.excerpt}</p>
              <span className={styles.guestEmail}>{p.date}</span>
            </div>
            <div className={styles.menuCardActions}>
              <button className={styles.iconBtn} onClick={() => setEditPost(p)}><Edit size={14}/></button>
              <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={async () => {
                await fetch(`${API_URL}/api/data/posts/${p.id}`, { method: 'DELETE' });
                setPosts(ps => ps.filter(x => x.id !== p.id));
              }}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Design ──
  const DesignView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}><div><h1 className={styles.pageTitle}>Design Controls</h1><p className={styles.pageSubtitle}>Customize your site&apos;s visual identity</p></div></div>
      <div className={styles.designGrid}>
        <div className={styles.designCard}>
          <h3 className={styles.editTitle}>Primary Accent Color</h3>
          <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginTop:'1rem' }}>
            <input type="color" value={designColor} onChange={e => setDesignColor(e.target.value)} className={styles.colorPicker} />
            <span className={styles.guestEmail}>{designColor}</span>
          </div>
          <div className={styles.colorSwatches}>
            {['#C9A84C','#D4AF37','#B8860B','#8B6914','#CD853F','#DAA520'].map(c => (
              <button key={c} className={`${styles.swatch} ${designColor===c?styles.swatchActive:''}`} style={{ background:c }} onClick={() => setDesignColor(c)} />
            ))}
          </div>
          <button className={styles.primaryBtn} style={{ marginTop:'1.5rem' }} onClick={() => { document.documentElement.style.setProperty('--gold', designColor); }}>Apply Color</button>
        </div>
        <div className={styles.designCard}>
          <h3 className={styles.editTitle}>Typography</h3>
          <p className={styles.pageSubtitle} style={{ marginTop:'0.75rem' }}>Display: Playfair Display</p>
          <p className={styles.pageSubtitle}>Body: Cormorant Garamond</p>
          <p className={styles.pageSubtitle}>UI: DM Sans</p>
          <div className={styles.fontPreview}>The Quick Brown Fox</div>
        </div>
        <div className={styles.designCard}>
          <h3 className={styles.editTitle}>Media Library</h3>
          <p className={styles.pageSubtitle} style={{ marginTop:'0.75rem' }}>Upload and manage site images</p>
          <div className={styles.uploadArea}>
            <ImageIcon size={32} className={styles.uploadIcon} />
            <span className={styles.uploadText}>Drag & drop images here<br />or click to upload</span>
            <input type="file" accept="image/*" multiple className={styles.fileInput} />
          </div>
        </div>
      </div>
    </div>
  );

  // ── SEO ──
  const SEOView = () => (
    <div className={styles.content}>
      <div className={styles.pageHeader}><div><h1 className={styles.pageTitle}>SEO Settings</h1><p className={styles.pageSubtitle}>Manage meta tags and search visibility</p></div><button className={styles.primaryBtn}><Check size={15}/> Save Changes</button></div>
      <div className={styles.editCard}>
        <div className={styles.editGrid}>
          {[
            ['Home Page Title',       'Raj\'s Cafe — Luxury Dining Experience'],
            ['Meta Description',      'Experience the finest cafe dining at Raj\'s Cafe. Artisanal coffee, gourmet cuisine, and an unforgettable atmosphere. Book your table today.'],
            ['Focus Keywords',        "Raj's Cafe, luxury cafe, fine dining, artisan coffee, gourmet food"],
            ['OG Image URL',          '/hero-dish.png'],
            ['Google Analytics ID',   'G-XXXXXXXXXX'],
            ['Site Verification Tag', ''],
          ].map(([label, val]) => (
            <div key={label} className={styles.editField} style={{ gridColumn: label === 'Meta Description' ? '1/-1' : undefined }}>
              <label className={styles.editLabel}>{label}</label>
              {label === 'Meta Description'
                ? <textarea className={styles.editInput} defaultValue={val} style={{ minHeight:'80px', resize:'vertical' }} />
                : <input className={styles.editInput} defaultValue={val} />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Orders ──
  const OrdersView = () => {
    const updateOrderStatus = async (id: string, newStatus: string) => {
      let message = '';
      if (newStatus === 'Cancelled') {
        const input = prompt('Please enter a reason for cancellation (optional):');
        if (input === null) return; // user cancelled the prompt
        message = input;
      } else if (newStatus === 'Completed') {
        message = 'Your order has been confirmed and completed!';
      }

      try {
        const res = await fetch(`${API_URL}/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, adminMessage: message })
        });
        const data = await res.json();
        if (data.success) {
          setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus, adminMessage: message } : o));
        }
      } catch (err) {
        console.error('Failed to update order status:', err);
      }
    };

    return (
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Orders</h1>
            <p className={styles.pageSubtitle}>{orders.filter(o=>o.status==='Pending').length} pending orders</p>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>{['Customer','Items','Amount','Info','Status','Actions'].map(h => <th key={h} className={styles.th}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.guestName}>{o.customerName || 'Guest'}</div>
                    <div className={styles.guestEmail}>{o.customerPhone || o.customerEmail}</div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.guestEmail} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className={styles.td}>₹{o.totalAmount}</td>
                  <td className={styles.td}>
                    <div className={styles.guestEmail}>{o.paymentMethod || 'Paid'}</div>
                    <div className={styles.guestEmail}>{new Date(o.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className={styles.td}><span className={`${styles.statusBadge} ${o.status === 'Completed' ? styles.status_confirmed : o.status === 'Cancelled' ? styles.status_cancelled : styles.status_pending}`}>{o.status}</span></td>
                  <td className={styles.td}>
                    {o.status === 'Pending' && (
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <button className={styles.btnConfirm} onClick={() => updateOrderStatus(o._id,'Completed')}><Check size={13}/> Complete</button>
                        <button className={styles.btnCancel} onClick={() => updateOrderStatus(o._id,'Cancelled')}><X size={13}/> Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const viewMap: Record<Tab, React.ReactNode> = {
    dashboard:    <DashboardView />,
    orders:       <OrdersView />,
    menu:         <MenuView />,
    reservations: <ReservationsView />,
    contacts:     <ContactsView />,
    hours:        <HoursView />,
    blog:         <BlogView />,
    design:       <DesignView />,
    seo:          <SEOView />,
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainArea}>
        {viewMap[tab]}
      </div>
    </div>
  );
}
