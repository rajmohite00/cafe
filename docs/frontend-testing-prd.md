# Raj's Cafe — Frontend Testing PRD

**Product**: Raj's Cafe Web Application  
**Version**: 1.0.0  
**Environment**: Production  
**Frontend**: https://rajs-cafe.vercel.app  
**Admin Panel**: https://rajs-cafe-admin.vercel.app  
**Backend API**: https://cafe-backend-azure.vercel.app  
**Stack**: Next.js 16 · React 19 · TypeScript · MongoDB Atlas · Vercel  

---

## 1. Scope

This document covers manual and automated testing requirements for all user-facing features of the Raj's Cafe frontend application and admin panel. It defines test cases, acceptance criteria, and priority levels for each feature area.

**In scope**
- All 14 public frontend pages
- All 9 admin panel tabs
- Full order placement and management flow (end-to-end)
- Authentication (signup, login, protected routes)
- Reservation booking
- Real-time data sync between frontend and admin
- Mobile responsiveness

**Out of scope**
- Backend unit tests (covered separately)
- Infrastructure / deployment pipeline tests
- Performance load testing

---

## 2. Users & Roles

| Role | Description | Entry Point |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor browsing the site | rajs-cafe.vercel.app |
| **Customer** | Logged-in user who can place orders and make reservations | /login, /signup |
| **Admin** | Cafe owner managing orders, menu, reservations | rajs-cafe-admin.vercel.app |

---

## 3. Test Environment

| Item | Value |
|------|-------|
| Browsers | Chrome 120+, Firefox 121+, Safari 17+, Edge 120+ |
| Mobile | iOS Safari 17+, Android Chrome 120+ |
| Screen sizes | 375px (mobile), 768px (tablet), 1280px (desktop), 1440px (large) |
| Backend | https://cafe-backend-azure.vercel.app (MongoDB Atlas connected) |
| Test accounts | Register fresh account per test run |

---

## 4. Feature Areas & Test Cases

---

### 4.1 Homepage (/)

**Components tested**: Navbar, Hero, About, Menu, LoyaltyNewsletter, Reservation, Location, Footer

#### TC-001 — Page loads successfully
- **Priority**: P0 (Critical)
- **Steps**: Navigate to https://rajs-cafe.vercel.app
- **Expected**: Page loads within 3s, all sections visible, no console errors
- **Pass criteria**: HTTP 200, LCP < 3s, no JS errors

#### TC-002 — Navbar renders correctly
- **Priority**: P0
- **Steps**: Load homepage on desktop and mobile
- **Expected**:
  - Desktop: Logo, Menu, Our Story, Brew Guide, FAQ links visible + Cart icon + My Orders + Login/User
  - Mobile: Hamburger menu visible, clicking opens nav overlay
  - Cart icon shows item count badge when items in cart

#### TC-003 — Hero section animation
- **Priority**: P1
- **Steps**: Load homepage, observe hero section
- **Expected**: Coffee animation frames cycle smoothly, CTA buttons ("Book a Table", "Explore Menu") are clickable

#### TC-004 — Menu section loads dynamic items
- **Priority**: P0
- **Steps**: Load homepage, scroll to menu section
- **Expected**:
  - Static menu items (from `menuData.ts`) display immediately
  - Admin-added items load within 2s from API
  - Category filter buttons work (All, Beverages, Mains, etc.)
  - Max 6 items shown on homepage
  - "View Full Menu →" link works

#### TC-005 — Category filter
- **Priority**: P1
- **Steps**: Click each category filter button in menu section
- **Expected**: Grid updates to show only matching items, "All" shows all items

#### TC-006 — Add to cart from homepage menu
- **Priority**: P0
- **Steps**: Click "Add" button on any menu card
- **Expected**: Button changes to "✓ Added" for 1.5s, cart icon badge increments by 1

#### TC-007 — Reservation form renders
- **Priority**: P0
- **Steps**: Scroll to reservation section on homepage
- **Expected**: 3-step form visible with Date & Time / Party Size / Your Details steps

#### TC-008 — Footer links
- **Priority**: P2
- **Steps**: Scroll to footer, check all links
- **Expected**: Social links open in new tab, internal nav links scroll to correct sections

---

### 4.2 Authentication (/login, /signup)

#### TC-009 — Signup flow
- **Priority**: P0
- **Steps**:
  1. Navigate to /signup
  2. Fill: Name = "Test User", Email = "test+[timestamp]@gmail.com", Phone = "9876543210", Password = "Test@1234"
  3. Click Register
- **Expected**: Account created, redirected to home or orders page, user name shown in navbar
- **API called**: POST /api/auth/register

#### TC-010 — Signup validation
- **Priority**: P1
- **Steps**: Submit form with missing fields (empty email, short password)
- **Expected**: Inline error messages shown, form not submitted

#### TC-011 — Login flow
- **Priority**: P0
- **Steps**:
  1. Navigate to /login
  2. Enter valid credentials from TC-009
  3. Click Sign In
- **Expected**: JWT stored in localStorage, user name shown in navbar, redirected
- **API called**: POST /api/auth/login

#### TC-012 — Login with wrong password
- **Priority**: P1
- **Steps**: Submit with correct email, wrong password
- **Expected**: "Invalid email or password." error message shown, no redirect

#### TC-013 — Protected route redirect
- **Priority**: P0
- **Steps**: Navigate to /checkout or /orders while not logged in
- **Expected**: Redirected to /login

#### TC-014 — Logout
- **Priority**: P1
- **Steps**: When logged in, click user icon → Sign Out (or equivalent)
- **Expected**: JWT cleared, user name removed from navbar, cart cleared

---

### 4.3 Full Menu (/menu)

#### TC-015 — Full menu page loads
- **Priority**: P0
- **Steps**: Navigate to /menu
- **Expected**: All menu items load, category filters show all categories, search if present works

#### TC-016 — Menu item detail page (/menu/[slug])
- **Priority**: P1
- **Steps**: Click on a static menu item card (not admin-added)
- **Expected**: Detail page opens with item name, description, price, "Add to Cart" button

#### TC-017 — Admin-added items link to /menu
- **Priority**: P1
- **Steps**: Click an admin-added menu card (MongoDB ObjectId slug)
- **Expected**: Redirects to /menu page (not a 404)

#### TC-018 — Add to cart from full menu
- **Priority**: P0
- **Steps**: Click Add button on any item
- **Expected**: Item added to cart, badge increments, "✓ Added" animation shown

---

### 4.4 Cart (/cart)

#### TC-019 — Cart page renders
- **Priority**: P0
- **Steps**: Add items, navigate to /cart
- **Expected**: All added items listed with name, quantity, price; subtotal calculated correctly

#### TC-020 — Quantity controls
- **Priority**: P1
- **Steps**: Click + and − on cart items
- **Expected**: Quantity updates, subtotal recalculates in real time

#### TC-021 — Remove item from cart
- **Priority**: P1
- **Steps**: Click remove/delete on a cart item
- **Expected**: Item removed, totals update, empty state shown if all removed

#### TC-022 — Cart persists across page refresh
- **Priority**: P1
- **Steps**: Add items, refresh page
- **Expected**: Cart items still present (stored in context/localStorage)

#### TC-023 — Cart empty state
- **Priority**: P2
- **Steps**: Navigate to /cart with empty cart
- **Expected**: "No items" message and "Browse Menu" CTA shown

#### TC-024 — Proceed to checkout button
- **Priority**: P0
- **Steps**: Have items in cart, click "Proceed to Checkout"
- **Expected**: Redirect to /checkout (if logged in) or /login (if not)

---

### 4.5 Checkout (/checkout)

**Prerequisites**: User logged in, items in cart

#### TC-025 — Checkout page loads with order summary
- **Priority**: P0
- **Steps**: Navigate to /checkout with items in cart
- **Expected**: Order summary shows all items, subtotal, GST (5%), delivery (₹40), grand total

#### TC-026 — Delivery details form
- **Priority**: P0
- **Steps**: Fill in Name, Phone, Email, Address, City, PIN Code
- **Expected**: "Continue to Payment →" button enables only when required fields filled

#### TC-027 — Delivery validation
- **Priority**: P1
- **Steps**: Click "Continue to Payment" without filling Address or PIN
- **Expected**: Alert shown: "Please fill in your complete delivery address..."

#### TC-028 — Payment method selection — UPI
- **Priority**: P0
- **Steps**: Select UPI, enter UPI ID
- **Expected**: UPI ID input appears, radio shows selected

#### TC-029 — Payment method selection — Card
- **Priority**: P0
- **Steps**: Select Credit/Debit Card
- **Expected**: Card number, name, expiry, CVV fields appear

#### TC-030 — Payment method selection — COD
- **Priority**: P1
- **Steps**: Select Cash on Delivery
- **Expected**: COD note shows grand total amount, no extra fields

#### TC-031 — Place order successfully
- **Priority**: P0 (Most critical)
- **Steps**:
  1. Fill delivery details
  2. Select COD
  3. Click "Place Order — ₹[total]"
- **Expected**:
  - Loading spinner shown during API call
  - POST /api/orders returns 201
  - Success screen shows "Order Placed! 🎉"
  - Order ID displayed
  - Cart cleared
  - Order status shows "Pending"
  - Order saved in localStorage for order history

#### TC-032 — Live status polling after order placed
- **Priority**: P0
- **Steps**: After placing order, stay on success screen
- **Expected**: Status updates every 5s via GET /api/orders/:id; when admin updates to "Preparing", status changes on screen

#### TC-033 — Admin note visible on success screen
- **Priority**: P1
- **Steps**: After placing order, have admin send a note, wait 5-10s
- **Expected**: Note from cafe appears under order status

---

### 4.6 Order History (/orders)

**Prerequisites**: User logged in, at least one order placed

#### TC-034 — Orders page loads
- **Priority**: P0
- **Steps**: Navigate to /orders
- **Expected**: All user orders listed, most recent first; stats grid shows totals

#### TC-035 — Order card expand/collapse
- **Priority**: P1
- **Steps**: Click on an order card header
- **Expected**: Expands to show items breakdown, delivery address, payment method, download bill button

#### TC-036 — Live order tracker for active orders
- **Priority**: P0
- **Steps**: Have an order in "Pending" or "Preparing" status, open /orders
- **Expected**: "🔴 Live Order Tracking" section shows with step progress (Pending → Preparing → Ready → Completed)

#### TC-037 — Status updates in real time
- **Priority**: P0
- **Steps**: Keep /orders open, have admin change order status to "Preparing"
- **Expected**: Within 10s, order status badge and tracker update automatically

#### TC-038 — Download bill button
- **Priority**: P1
- **Steps**: Expand an order with status "Completed" or "Ready"
- **Expected**: "📄 Download Bill (PDF)" button visible, clicking opens print-ready invoice in new tab

#### TC-039 — Stats report cards
- **Priority**: P2
- **Steps**: Open /orders with multiple orders in different statuses
- **Expected**: Cards show correct count for Total Orders, Active, Completed, Cancelled, Total Spent, Avg Order Value

#### TC-040 — Cached orders shown on slow connection
- **Priority**: P1
- **Steps**: Load /orders, then throttle network to Slow 3G, refresh
- **Expected**: Cached orders shown immediately from localStorage while fresh data loads

---

### 4.7 Table Reservation

#### TC-041 — Reservation form — Step 1 (Date & Time)
- **Priority**: P0
- **Steps**: On homepage, scroll to reservation section; select a future date, pick a time slot, click "Continue"
- **Expected**: Step 1 validation passes only when both date and time selected; past dates blocked by `min` attribute

#### TC-042 — Reservation form — Step 2 (Party Details)
- **Priority**: P0
- **Steps**: Fill Name, Phone, Email, select Occasion, add special requests, click "Review"
- **Expected**: "Review" button only enables when Name, Phone, Email filled

#### TC-043 — Reservation form — Step 3 (Review & Confirm)
- **Priority**: P0
- **Steps**: Review all filled details, click "Confirm — Book Now"
- **Expected**:
  - POST /api/data/reservations called with status "pending"
  - Success card shown with confirmation message
  - "Book Another Table" resets form

#### TC-044 — Reservation validation — invalid email
- **Priority**: P1
- **Steps**: Enter malformed email like "notanemail"
- **Expected**: HTML5 validation prevents submission

#### TC-045 — Reservation appears in admin panel
- **Priority**: P0
- **Steps**: After TC-043, open admin panel → Reservations tab
- **Expected**: New reservation visible within 10s with status "pending"

---

### 4.8 Contact Form

#### TC-046 — Contact form submission
- **Priority**: P1
- **Steps**: Fill contact form (Name, Email, Subject, Message), submit
- **Expected**: Success message shown, POST /api/data/contacts returns 201

#### TC-047 — Contact appears in admin
- **Priority**: P1
- **Steps**: After TC-046, open admin → Contacts tab
- **Expected**: New contact message visible with "unread" badge

---

### 4.9 Other Frontend Pages

#### TC-048 — Blog page (/blog)
- **Priority**: P2
- **Steps**: Navigate to /blog
- **Expected**: Published blog posts from admin load, clicking a post shows excerpt

#### TC-049 — Brew Guide (/brew-guide)
- **Priority**: P2
- **Steps**: Navigate to /brew-guide
- **Expected**: Page loads with brewing guide content, no broken images

#### TC-050 — FAQ page (/faq)
- **Priority**: P2
- **Steps**: Navigate to /faq
- **Expected**: Accordion questions expand/collapse correctly

#### TC-051 — Loyalty/Newsletter (/loyalty)
- **Priority**: P2
- **Steps**: Navigate to /loyalty, enter email
- **Expected**: Subscription form accepts valid email, shows confirmation

#### TC-052 — Gift page (/gift)
- **Priority**: P3
- **Steps**: Navigate to /gift
- **Expected**: Page renders without errors

#### TC-053 — Coffee Quiz (/quiz)
- **Priority**: P3
- **Steps**: Navigate to /quiz, answer questions
- **Expected**: Quiz steps advance, result shown at end

---

## 5. Admin Panel Test Cases

**URL**: https://rajs-cafe-admin.vercel.app

### 5.1 Dashboard Tab

#### TC-054 — Dashboard stats load
- **Priority**: P0
- **Steps**: Open admin panel, land on Dashboard
- **Expected**: Stats cards show correct counts for Orders, Reservations, Income, Unread Messages; data refreshes every 10s

#### TC-055 — Live activity feed
- **Priority**: P1
- **Steps**: Have a customer place an order, watch Dashboard
- **Expected**: New activity entry appears within 10s with "order" type and customer name

#### TC-056 — Recent reservations table
- **Priority**: P1
- **Steps**: Have a customer make a reservation, check Dashboard
- **Expected**: Reservation appears in "Recent Reservations" table with Confirm/Cancel buttons

### 5.2 Orders Tab

#### TC-057 — Orders list loads
- **Priority**: P0
- **Steps**: Click Orders tab
- **Expected**: All orders listed with Customer, Items, Amount, Status columns; pending count shown in header

#### TC-058 — Accept order
- **Priority**: P0
- **Steps**: Find a "Pending" order, click "✓ Accept"
- **Expected**: Status changes to "Preparing" immediately in UI; customer's order page updates within 10s

#### TC-059 — Complete order
- **Priority**: P0
- **Steps**: Find a "Preparing" order, click "✓ Complete"
- **Expected**: Status changes to "Completed"; badge color changes to green

#### TC-060 — Cancel order with reason
- **Priority**: P0
- **Steps**: Find a "Pending" order, click ✕, enter reason in prompt
- **Expected**: Status changes to "Cancelled"; admin message saved; customer sees message on their orders page

#### TC-061 — Send note to customer
- **Priority**: P1
- **Steps**: For a Pending/Preparing order, type in the note input, click "Send"
- **Expected**: Note saved to order; customer sees "Message from Raj's Cafe:" on their order page

#### TC-062 — Real-time order appearance
- **Priority**: P0
- **Steps**: Keep admin Orders tab open; customer places a new order
- **Expected**: New order appears within 10s without manual refresh

### 5.3 Menu Manager Tab

#### TC-063 — Menu items load
- **Priority**: P0
- **Steps**: Click Menu tab
- **Expected**: All admin-added menu items shown as cards with emoji, name, category, price

#### TC-064 — Add new dish
- **Priority**: P0
- **Steps**: Click "+ Add Dish"
- **Expected**: New "New Dish" item created in DB, edit form opens automatically with that item pre-selected

#### TC-065 — Edit dish details
- **Priority**: P0
- **Steps**: Click Edit on a menu item, change Name and Price, click "Save Changes"
- **Expected**: Toast "✓ Dish saved & live on website!", card updates, change visible on frontend within 30s

#### TC-066 — Toggle item visibility
- **Priority**: P1
- **Steps**: Click eye icon on a visible item
- **Expected**: Item marked as unavailable (badge shown), item hidden from frontend menu within 30s

#### TC-067 — Delete dish
- **Priority**: P1
- **Steps**: Click trash icon, confirm in dialog
- **Expected**: Item removed from list and from DB; "🗑 Dish removed from menu" toast

### 5.4 Reservations Tab

#### TC-068 — Reservations list
- **Priority**: P0
- **Steps**: Click Reservations tab
- **Expected**: All reservations listed with Guest, Contact, Date, Time, Guests, Occasion, Status

#### TC-069 — Confirm reservation
- **Priority**: P0
- **Steps**: Click "✓ Confirm" on a pending reservation
- **Expected**: Status changes to "confirmed" in UI and DB; toast shown

#### TC-070 — Cancel reservation
- **Priority**: P0
- **Steps**: Click ✕ on a pending reservation
- **Expected**: Status changes to "cancelled"; badge color changes to red

### 5.5 Contacts Tab

#### TC-071 — View contact messages
- **Priority**: P1
- **Steps**: Click Contacts tab
- **Expected**: All contact submissions listed with unread highlighted

#### TC-072 — Mark as read
- **Priority**: P1
- **Steps**: Click "Mark as Read" on an unread message
- **Expected**: Unread indicator removed, badge count decrements

#### TC-073 — Reply via email link
- **Priority**: P2
- **Steps**: Click "Reply via Email"
- **Expected**: Opens system mail client with customer email pre-filled

### 5.6 Hours Tab

#### TC-074 — Edit opening hours
- **Priority**: P1
- **Steps**: Change Monday open time to 09:00, click "Save & Go Live"
- **Expected**: Toast "✓ Opening hours saved & live on website!", frontend footer/location section reflects new time within 5 min (revalidation)

#### TC-075 — Mark a day as closed
- **Priority**: P1
- **Steps**: Toggle "Open" switch on Sunday to off, save
- **Expected**: Sunday shows "Closed" state, time inputs hidden

### 5.7 Design Tab

#### TC-076 — Change accent color
- **Priority**: P2
- **Steps**: Pick a new color from color picker or swatches, click "Apply & Save to Website"
- **Expected**: Toast confirms save; CSS variable `--gold` updates in admin; frontend picks up new color on next load

### 5.8 SEO Tab

#### TC-077 — Save SEO settings
- **Priority**: P2
- **Steps**: Update Page Title to "Test Title", click "Save & Go Live"
- **Expected**: Toast confirms; next page load of frontend has updated `<title>` tag (may require ISR revalidation within 5 min)

### 5.9 Blog Tab

#### TC-078 — Create blog post
- **Priority**: P2
- **Steps**: Click "+ New Post", enter title and excerpt, set status to Published, save
- **Expected**: Post visible on /blog page on frontend

#### TC-079 — Draft post not visible on frontend
- **Priority**: P2
- **Steps**: Create post with status "Draft"
- **Expected**: Post visible in admin but NOT on /blog frontend page

---

## 6. Cross-Cutting Concerns

### 6.1 Real-Time Sync

#### TC-080 — Order status propagates customer ↔ admin
- **Priority**: P0
- **Steps**:
  1. Customer places order on frontend
  2. Admin sees it within 10s
  3. Admin clicks Accept
  4. Customer's /orders page shows "Preparing" within 10s
- **Expected**: Full round-trip within 20s

### 6.2 Error Handling

#### TC-081 — Backend unreachable — admin shows banner
- **Priority**: P1
- **Steps**: Temporarily block network, load admin panel
- **Expected**: Yellow/red banner "Could not reach backend" shown; cached data still displayed

#### TC-082 — Order placement failure shows alert
- **Priority**: P1
- **Steps**: Block network mid-checkout, click Place Order
- **Expected**: Error alert "There was an error placing your order. Please try again." — no silent failure

### 6.3 Mobile Responsiveness

#### TC-083 — Homepage mobile layout
- **Priority**: P1
- **Steps**: Load homepage at 375px width
- **Expected**: No horizontal scroll, menu grid wraps, navbar collapses to mobile format

#### TC-084 — Checkout mobile layout
- **Priority**: P1
- **Steps**: Open /checkout at 375px width
- **Expected**: Form fields full-width, order summary stacks below form (not side-by-side)

#### TC-085 — Admin panel mobile layout
- **Priority**: P1
- **Steps**: Open admin at 375px width
- **Expected**: Mobile bottom nav visible with icons, sidebar hidden, tables scroll horizontally

### 6.4 SEO & Metadata

#### TC-086 — Homepage meta tags
- **Priority**: P2
- **Steps**: View page source of https://rajs-cafe.vercel.app
- **Expected**: `<title>`, `<meta name="description">`, og:title, og:description tags present

#### TC-087 — Dynamic SEO from admin
- **Priority**: P2
- **Steps**: Admin updates SEO title in admin panel; wait 5 min for ISR revalidation; check page source
- **Expected**: New title appears in `<title>` tag

---

## 7. API Endpoints Reference

| Method | Endpoint | Used by | Purpose |
|--------|----------|---------|---------|
| GET | /api/health | All | Connectivity check |
| POST | /api/auth/register | Frontend | User signup |
| POST | /api/auth/login | Frontend | User login |
| GET | /api/auth/me | Frontend | Get current user |
| GET | /api/orders | Admin | Get all orders |
| POST | /api/orders | Frontend | Place new order |
| GET | /api/orders/:id | Frontend | Get single order (status polling) |
| PUT | /api/orders/:id | Admin | Update order status/message |
| GET | /api/orders/user/:userId | Frontend | Get user order history |
| GET | /api/data/menu | Both | Get menu items |
| POST | /api/data/menu | Admin | Add menu item |
| PUT | /api/data/menu/:id | Admin | Update menu item |
| DELETE | /api/data/menu/:id | Admin | Delete menu item |
| GET | /api/data/reservations | Admin | Get all reservations |
| POST | /api/data/reservations | Frontend | Book reservation |
| PUT | /api/data/reservations/:id | Admin | Update reservation status |
| GET | /api/data/contacts | Admin | Get contact messages |
| PUT | /api/data/contacts/:id | Admin | Mark contact as read |
| GET | /api/data/posts | Both | Get blog posts |
| POST | /api/data/posts | Admin | Create blog post |
| PUT | /api/data/settings/:key | Admin | Save hours/SEO/design |
| GET | /api/data/settings/:key | Both | Get settings |
| GET | /api/activities | Admin | Get activity feed |

---

## 8. Test Execution Order (Priority Matrix)

Run in this order to catch blocking issues first:

**P0 — Must pass before release**
1. TC-001 (Homepage loads)
2. TC-009 (Signup)
3. TC-011 (Login)
4. TC-013 (Protected routes)
5. TC-031 (Place order)
6. TC-032 (Order status polling)
7. TC-057 (Admin orders list)
8. TC-058 (Admin accept order)
9. TC-060 (Admin cancel order)
10. TC-062 (Real-time order in admin)
11. TC-080 (Full round-trip sync)
12. TC-041 → TC-043 (Reservation flow)
13. TC-006 → TC-024 (Add to cart → checkout)

**P1 — Must pass before user launch**
- TC-010, TC-012 (auth validation)
- TC-022 (cart persistence)
- TC-034 → TC-037 (order history + live tracking)
- TC-064 → TC-067 (menu management)
- TC-069, TC-070 (reservation management)
- TC-081, TC-082 (error handling)
- TC-083 → TC-085 (mobile responsive)

**P2/P3 — Should pass but non-blocking**
- Blog, FAQ, Quiz, Gift pages
- SEO meta tags
- Design/color customization

---

## 9. Acceptance Criteria Summary

The application is ready for public use when:

- [ ] All P0 test cases pass
- [ ] All P1 test cases pass
- [ ] Order placement → admin visibility ≤ 10 seconds
- [ ] Admin status update → customer visibility ≤ 10 seconds
- [ ] No unhandled exceptions in browser console on any P0 page
- [ ] All pages load with HTTP 200 on production URLs
- [ ] Mobile layout has no horizontal scroll at 375px
- [ ] Backend health endpoint returns `"mongodb": "connected"`

---

*Document created: 2026-06-27*  
*Project: Raj's Cafe — github.com/rajmohite00/cafe*
