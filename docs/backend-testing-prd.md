# Raj's Cafe — Backend Testing PRD

**Product**: Raj's Cafe REST API  
**Version**: 1.0.0  
**Base URL**: https://cafe-backend-azure.vercel.app  
**Runtime**: Node.js + Express 4.21 on Vercel Serverless  
**Database**: MongoDB Atlas (mongoose 8.7)  
**Auth**: JWT (jsonwebtoken 9.0, bcryptjs 3.0, 30-day tokens)  

---

## 1. Scope

This document defines test cases, acceptance criteria, and priority levels for all backend API endpoints of the Raj's Cafe application. Tests cover happy paths, validation failures, authentication, edge cases, and security.

**Route groups in scope**

| Prefix | File | Description |
|--------|------|-------------|
| `/api/auth` | authRoutes.js | User register, login, JWT auth |
| `/api/orders` | orderRoutes.js | Order CRUD + status management |
| `/api/activities` | activityRoutes.js | Activity log |
| `/api/data` | dynamicRoutes.js | Menu, Reservations, Contacts, Posts, Settings |
| `/api/health` | server.js | Uptime + DB status |
| `/` | server.js | Root info endpoint |

**Out of scope**
- Frontend integration tests (see frontend-testing-prd.md)
- Infrastructure / Vercel deployment pipeline
- Database backup / restore procedures


---

## 2. Test Environment

| Item | Value |
|------|-------|
| Production base URL | https://cafe-backend-azure.vercel.app |
| Local base URL | http://localhost:5000 |
| Tool | curl, Postman, or PowerShell `Invoke-RestMethod` |
| DB | MongoDB Atlas — rajscafe cluster |
| Auth header | `Authorization: Bearer <token>` |
| Content-Type | `application/json` for all POST/PUT |

### Standard Response Shape

All endpoints return:
```json
{ "success": true|false, "data": {}, "message": "..." }
```

Errors always include `"success": false` and a `"message"` string.

---

## 3. Infrastructure & Server Tests

### TC-001 — Health check
- **Method**: `GET /api/health`
- **Priority**: P0
- **Expected response**: HTTP 200
```json
{
  "status": "OK",
  "message": "Backend is running correctly.",
  "timestamp": "<ISO string>",
  "environment": "production",
  "mongodb": "connected"
}
```
- **Pass criteria**: `mongodb` field = `"connected"`, HTTP 200

### TC-002 — Root route
- **Method**: `GET /`
- **Priority**: P1
- **Expected response**: HTTP 200
```json
{
  "name": "Raj's Cafe API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": ["/api/health", "/api/orders", "/api/data", "/api/auth", "/api/activities"]
}
```

### TC-003 — Unknown route returns 404
- **Method**: `GET /api/nonexistent`
- **Priority**: P1
- **Expected**: HTTP 404, `{ "success": false, "message": "Route GET /nonexistent not found" }`

### TC-004 — CORS allows rajs-cafe.vercel.app
- **Method**: `OPTIONS /api/orders` with `Origin: https://rajs-cafe.vercel.app`
- **Priority**: P0
- **Expected**: HTTP 200/204, `Access-Control-Allow-Origin: https://rajs-cafe.vercel.app`

### TC-005 — CORS allows rajs-cafe-admin.vercel.app
- **Method**: `OPTIONS /api/orders` with `Origin: https://rajs-cafe-admin.vercel.app`
- **Priority**: P0
- **Expected**: HTTP 200/204, CORS headers present

### TC-006 — CORS blocks unknown origin
- **Method**: `GET /api/health` with `Origin: https://evil-site.com`
- **Priority**: P1
- **Expected**: HTTP 500 or CORS error, request blocked

### TC-007 — Security headers present
- **Method**: `GET /api/health`
- **Priority**: P1
- **Expected response headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`


---

## 4. Authentication API — `/api/auth`

### 4.1 POST /api/auth/register

#### TC-008 — Register new user successfully
- **Priority**: P0
- **Body**:
```json
{
  "name": "Test User",
  "email": "test+<timestamp>@gmail.com",
  "phone": "9876543210",
  "password": "Test@1234"
}
```
- **Expected**: HTTP 201
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "<id>", "name": "Test User", "email": "...", "phone": "9876543210" }
}
```
- **Pass criteria**: token is a valid JWT, password NOT in response, user created in DB

#### TC-009 — Register with missing name
- **Priority**: P1
- **Body**: `{ "email": "x@x.com", "phone": "9999999999", "password": "abc123" }`
- **Expected**: HTTP 400, `{ "success": false, "message": "All fields are required." }`

#### TC-010 — Register with missing email
- **Priority**: P1
- **Body**: `{ "name": "A", "phone": "9999999999", "password": "abc123" }`
- **Expected**: HTTP 400, `"All fields are required."`

#### TC-011 — Register with missing password
- **Priority**: P1
- **Body**: `{ "name": "A", "email": "a@b.com", "phone": "9999999999" }`
- **Expected**: HTTP 400, `"All fields are required."`

#### TC-012 — Register with duplicate email
- **Priority**: P0
- **Steps**: Register same email twice
- **Expected (2nd attempt)**: HTTP 409, `"Email already registered. Please login."`

#### TC-013 — Password is hashed in database
- **Priority**: P0
- **Steps**: Register user, query DB directly for the user record
- **Expected**: `password` field starts with `$2b$12$` (bcrypt hash), NOT plain text

### 4.2 POST /api/auth/login

#### TC-014 — Login with valid credentials
- **Priority**: P0
- **Body**: `{ "email": "<registered>", "password": "<correct>" }`
- **Expected**: HTTP 200
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "phone": "..." }
}
```

#### TC-015 — Login with wrong password
- **Priority**: P0
- **Body**: `{ "email": "<registered>", "password": "wrongpass" }`
- **Expected**: HTTP 401, `"Invalid email or password."`

#### TC-016 — Login with unregistered email
- **Priority**: P1
- **Body**: `{ "email": "nobody@test.com", "password": "anything" }`
- **Expected**: HTTP 401, `"Invalid email or password."`

#### TC-017 — Login with missing fields
- **Priority**: P1
- **Body**: `{ "email": "a@b.com" }` (no password)
- **Expected**: HTTP 400, `"Email and password are required."`

#### TC-018 — JWT token is valid and expires in 30 days
- **Priority**: P1
- **Steps**: Decode the returned JWT
- **Expected**: `exp` claim = `iat + 2592000` (30 days in seconds), `id` field present

### 4.3 GET /api/auth/me (protected)

#### TC-019 — Get current user with valid token
- **Priority**: P0
- **Headers**: `Authorization: Bearer <valid_token>`
- **Expected**: HTTP 200, `{ "success": true, "user": { ...user fields, no password } }`

#### TC-020 — Get current user without token
- **Priority**: P0
- **Headers**: none
- **Expected**: HTTP 401, `"Not authenticated."`

#### TC-021 — Get current user with malformed token
- **Priority**: P1
- **Headers**: `Authorization: Bearer badtoken123`
- **Expected**: HTTP 401, `"Invalid or expired token."`

#### TC-022 — Get current user with expired token
- **Priority**: P1
- **Steps**: Use a JWT signed with `expiresIn: 1s`, wait 2s
- **Expected**: HTTP 401, `"Invalid or expired token."`

#### TC-023 — Response never includes password
- **Priority**: P0
- **Steps**: Call GET /api/auth/me with valid token
- **Expected**: Response body has no `password` field

### 4.4 GET /api/auth/users

#### TC-024 — Get all users
- **Priority**: P2
- **Expected**: HTTP 200, `{ "success": true, "data": [...users without password field] }`
- **Note**: This endpoint is currently unprotected — documents existing behavior


---

## 5. Orders API — `/api/orders`

**Model fields**: `userId`, `customerName`(required), `customerEmail`, `customerPhone`, `address`, `paymentMethod`, `items[]` (name/quantity/price required), `totalAmount`(required), `status` (enum: Pending/Preparing/Ready/Completed/Cancelled, default: Pending), `adminMessage`

### 5.1 POST /api/orders — Create order

#### TC-025 — Create order successfully (guest)
- **Priority**: P0
- **Body**:
```json
{
  "customerName": "Priya Sharma",
  "customerEmail": "priya@test.com",
  "customerPhone": "9876543210",
  "address": "12 MG Road, Delhi - 110001",
  "paymentMethod": "cod",
  "items": [
    { "name": "Masala Chai", "quantity": 2, "price": 75 },
    { "name": "Veg Puff", "quantity": 1, "price": 60 }
  ],
  "totalAmount": 250,
  "userId": null
}
```
- **Expected**: HTTP 201, `{ "success": true, "data": { "_id": "...", "status": "Pending", ... } }`
- **Pass criteria**: `status` defaults to `"Pending"`, `_id` present, activity log entry created

#### TC-026 — Create order with userId (logged-in user)
- **Priority**: P0
- **Body**: Same as TC-025, with `"userId": "<valid_mongo_id>"`
- **Expected**: HTTP 201, `data.userId` = provided userId

#### TC-027 — Create order — missing customerName
- **Priority**: P1
- **Body**: Omit `customerName`
- **Expected**: HTTP 500 (Mongoose validation error — `customerName` is required)

#### TC-028 — Create order — missing items
- **Priority**: P1
- **Body**: Omit `items` array
- **Expected**: HTTP 500 or 400

#### TC-029 — Create order — missing totalAmount
- **Priority**: P1
- **Body**: Omit `totalAmount`
- **Expected**: HTTP 500 (required field)

#### TC-030 — Activity log created after order
- **Priority**: P0
- **Steps**: Create order, then GET /api/activities
- **Expected**: Most recent activity has `type: "order"`, `description` contains customer name and amount

### 5.2 GET /api/orders — Get all orders

#### TC-031 — Get all orders returns array
- **Priority**: P0
- **Expected**: HTTP 200, `{ "success": true, "data": [...] }`, sorted by `createdAt` descending

#### TC-032 — Orders sorted newest first
- **Priority**: P1
- **Steps**: Create 2 orders 1s apart, GET /api/orders
- **Expected**: More recent order is `data[0]`

#### TC-033 — Empty orders returns empty array
- **Priority**: P2
- **Steps**: Test on a clean collection
- **Expected**: `{ "success": true, "data": [] }`

### 5.3 GET /api/orders/:id — Get single order

#### TC-034 — Get order by valid ID
- **Priority**: P0
- **Steps**: Create order, use returned `_id`
- **Expected**: HTTP 200, `data._id` matches, all fields present

#### TC-035 — Get order with non-existent ID
- **Priority**: P1
- **Steps**: Use a valid-format but non-existent ObjectId
- **Expected**: HTTP 404, `"Order not found"`

#### TC-036 — Get order with invalid ID format
- **Priority**: P1
- **Steps**: `GET /api/orders/notanid`
- **Expected**: HTTP 500 (Mongoose CastError)

### 5.4 PUT /api/orders/:id — Update order status

#### TC-037 — Update status to Preparing
- **Priority**: P0
- **Body**: `{ "status": "Preparing" }`
- **Expected**: HTTP 200, `data.status = "Preparing"`

#### TC-038 — Update status to Completed
- **Priority**: P0
- **Body**: `{ "status": "Completed" }`
- **Expected**: HTTP 200, `data.status = "Completed"`

#### TC-039 — Update status to Cancelled with adminMessage
- **Priority**: P0
- **Body**: `{ "status": "Cancelled", "adminMessage": "Kitchen closed today" }`
- **Expected**: HTTP 200, `data.status = "Cancelled"`, `data.adminMessage = "Kitchen closed today"`

#### TC-040 — Update adminMessage only (status unchanged)
- **Priority**: P1
- **Body**: `{ "status": "Preparing", "adminMessage": "Your chai is brewing!" }`
- **Expected**: HTTP 200, both fields updated

#### TC-041 — Invalid status value rejected
- **Priority**: P1
- **Body**: `{ "status": "Flying" }`
- **Expected**: HTTP 500, Mongoose enum validation error

#### TC-042 — Update non-existent order
- **Priority**: P1
- **Body**: `{ "status": "Completed" }`
- **Steps**: Use valid-format but non-existent ID
- **Expected**: HTTP 404, `"Order not found"`

### 5.5 GET /api/orders/user/:userId — User order history

#### TC-043 — Get orders for specific user
- **Priority**: P0
- **Steps**: Create order with userId, GET /api/orders/user/:userId
- **Expected**: HTTP 200, array containing only that user's orders

#### TC-044 — Get orders for user with no orders
- **Priority**: P1
- **Steps**: Use a valid userId that has no orders
- **Expected**: HTTP 200, `{ "success": true, "data": [] }`

#### TC-045 — User ID string matching fallback
- **Priority**: P1
- **Steps**: Create order with userId as ObjectId; query with userId as string
- **Expected**: HTTP 200, orders returned (string comparison fallback works)


---

## 6. Activities API — `/api/activities`

### 6.1 GET /api/activities

#### TC-046 — Get activities returns array
- **Priority**: P1
- **Expected**: HTTP 200, `{ "success": true, "data": [...] }`, max 50 entries, sorted newest first

#### TC-047 — Activities sorted by timestamp descending
- **Priority**: P1
- **Steps**: Create 2 activities, GET /api/activities
- **Expected**: Most recent is `data[0]`

#### TC-048 — Max 50 activities returned
- **Priority**: P2
- **Steps**: Ensure >50 activities in DB
- **Expected**: `data.length <= 50`

### 6.2 POST /api/activities

#### TC-049 — Create activity successfully
- **Priority**: P1
- **Body**: `{ "type": "visit", "description": "User viewed menu page" }`
- **Expected**: HTTP 201, `{ "success": true, "data": { "_id": "...", "type": "visit", "ipAddress": "..." } }`

#### TC-050 — IP address captured from request
- **Priority**: P1
- **Steps**: POST /api/activities from a real browser
- **Expected**: `data.ipAddress` is not `"Unknown"`, reflects client IP or `x-forwarded-for`

#### TC-051 — Localhost IP normalized
- **Priority**: P2
- **Steps**: POST from localhost (::1 or 127.0.0.1)
- **Expected**: `data.ipAddress = "Local User"`

---

## 7. Dynamic Data API — `/api/data`

This router handles 4 resources (`menu`, `reservations`, `contacts`, `posts`) via generic CRUD, plus singleton settings (`/settings/:key`). Rate limit: 100 req/min per IP. XSS sanitization applied to all string fields.

### 7.1 GET /api/data/:resource

#### TC-052 — Get menu items
- **Priority**: P0
- **Route**: `GET /api/data/menu`
- **Expected**: HTTP 200, `{ "success": true, "data": [...], "pagination": { "page": 1, "limit": 50, "total": N, "pages": N } }`

#### TC-053 — Get reservations
- **Priority**: P0
- **Route**: `GET /api/data/reservations`
- **Expected**: HTTP 200, array of reservations with pagination

#### TC-054 — Get contacts
- **Priority**: P1
- **Route**: `GET /api/data/contacts`
- **Expected**: HTTP 200, array of contacts

#### TC-055 — Get posts
- **Priority**: P1
- **Route**: `GET /api/data/posts`
- **Expected**: HTTP 200, array of blog posts

#### TC-056 — Invalid resource returns 404
- **Priority**: P1
- **Route**: `GET /api/data/orders` (not in models map)
- **Expected**: HTTP 404, `"Resource not found"`

#### TC-057 — Pagination — page 1
- **Priority**: P2
- **Route**: `GET /api/data/menu?page=1&limit=2`
- **Expected**: `data.length <= 2`, `pagination.page = 1`, `pagination.limit = 2`

#### TC-058 — Pagination — limit capped at 100
- **Priority**: P2
- **Route**: `GET /api/data/menu?limit=9999`
- **Expected**: `pagination.limit = 100` (capped), not 9999

#### TC-059 — Results sorted by createdAt descending
- **Priority**: P1
- **Steps**: Create 2 menu items, GET /api/data/menu
- **Expected**: Most recently created is `data[0]`

### 7.2 POST /api/data/:resource

#### TC-060 — Create menu item successfully
- **Priority**: P0
- **Body**: `{ "name": "Test Dish", "price": 150, "category": "Mains", "emoji": "🍛", "visible": true }`
- **Expected**: HTTP 201, `{ "success": true, "data": { "_id": "...", "name": "Test Dish", ... } }`

#### TC-061 — Create menu item — missing name
- **Priority**: P1
- **Body**: `{ "price": 100 }`
- **Expected**: HTTP 400, `"Name and valid price are required for menu items"`

#### TC-062 — Create menu item — negative price
- **Priority**: P1
- **Body**: `{ "name": "Bad Item", "price": -50 }`
- **Expected**: HTTP 400, `"Name and valid price are required for menu items"`

#### TC-063 — Create menu item — price as string (invalid type)
- **Priority**: P1
- **Body**: `{ "name": "String Price", "price": "free" }`
- **Expected**: HTTP 400, `"Name and valid price are required for menu items"` (typeof check)

#### TC-064 — Create reservation successfully
- **Priority**: P0
- **Body**:
```json
{
  "name": "Raj Kumar",
  "email": "raj@test.com",
  "phone": "9876543210",
  "date": "2026-12-25",
  "time": "19:00",
  "guests": 4,
  "occasion": "Birthday",
  "status": "pending"
}
```
- **Expected**: HTTP 201, `data.status = "pending"`, all fields saved

#### TC-065 — Create reservation — missing required fields
- **Priority**: P1
- **Body**: Omit `date`
- **Expected**: HTTP 400, `"Name, email, date, time, and guests are required for reservations"`

#### TC-066 — Create reservation — invalid email format
- **Priority**: P1
- **Body**: `{ ..., "email": "notanemail" }`
- **Expected**: HTTP 400, `"Invalid email format"`

#### TC-067 — Create contact message
- **Priority**: P1
- **Body**: `{ "name": "User", "email": "u@u.com", "subject": "Query", "message": "Hello there" }`
- **Expected**: HTTP 201, `{ "success": true, "data": { "_id": "...", "name": "User", ... } }`

#### TC-068 — Create blog post
- **Priority**: P2
- **Body**: `{ "title": "Test Post", "excerpt": "Content here", "status": "draft" }`
- **Expected**: HTTP 201, `data.title = "Test Post"`

#### TC-069 — XSS sanitization — script tags stripped
- **Priority**: P0
- **Body**: `{ "name": "<script>alert(1)</script>Safe Name", "price": 100 }` to POST /api/data/menu
- **Expected**: HTTP 201, saved `name` = `"Safe Name"` (script tag removed)

### 7.3 PUT /api/data/:resource/:id

#### TC-070 — Update menu item
- **Priority**: P0
- **Steps**: Create menu item, PUT with `{ "price": 200 }`
- **Expected**: HTTP 200, `data.price = 200`, `updatedAt` timestamp updated

#### TC-071 — Update reservation status to confirmed
- **Priority**: P0
- **Body**: `{ "status": "confirmed" }`
- **Expected**: HTTP 200, `data.status = "confirmed"`

#### TC-072 — Update reservation status to cancelled
- **Priority**: P0
- **Body**: `{ "status": "cancelled" }`
- **Expected**: HTTP 200, `data.status = "cancelled"`

#### TC-073 — Update contact — mark as read
- **Priority**: P1
- **Body**: `{ "status": "read" }`
- **Expected**: HTTP 200, `data.status = "read"`

#### TC-074 — Update with invalid ObjectId
- **Priority**: P1
- **Route**: `PUT /api/data/menu/notanobjectid`
- **Expected**: HTTP 400, `"Invalid ID format"`

#### TC-075 — Update non-existent document
- **Priority**: P1
- **Steps**: Use valid-format but non-existent ID
- **Expected**: HTTP 404, `"Item not found"`

### 7.4 DELETE /api/data/:resource/:id

#### TC-076 — Delete menu item successfully
- **Priority**: P0
- **Steps**: Create item, DELETE by ID
- **Expected**: HTTP 200, `{ "success": true, "message": "Item deleted successfully", "data": { ...deleted } }`
- **Verify**: GET /api/data/menu no longer contains that ID

#### TC-077 — Delete with invalid ID format
- **Priority**: P1
- **Route**: `DELETE /api/data/menu/badid`
- **Expected**: HTTP 400, `"Invalid ID format"`

#### TC-078 — Delete non-existent document
- **Priority**: P1
- **Steps**: Use valid-format but non-existent ID
- **Expected**: HTTP 404, `"Item not found"`

### 7.5 GET /api/data/settings/:key

#### TC-079 — Get existing setting
- **Priority**: P1
- **Route**: `GET /api/data/settings/hours`
- **Expected**: HTTP 200, `{ "success": true, "data": { "key": "hours", "value": [...] } }`

#### TC-080 — Get non-existent setting
- **Priority**: P2
- **Route**: `GET /api/data/settings/nonexistent`
- **Expected**: HTTP 200, `{ "success": true, "data": null }`

#### TC-081 — Setting key with special characters rejected
- **Priority**: P1
- **Route**: `GET /api/data/settings/bad!key`
- **Expected**: HTTP 400, `"Invalid setting key format"`

### 7.6 PUT /api/data/settings/:key

#### TC-082 — Create/update setting (upsert)
- **Priority**: P1
- **Route**: `PUT /api/data/settings/design`
- **Body**: `{ "value": { "color": "#FF5733" } }`
- **Expected**: HTTP 200, `data.value.color = "#FF5733"`

#### TC-083 — Update setting — missing value field
- **Priority**: P1
- **Body**: `{}` (no value key)
- **Expected**: HTTP 400, `"Setting value is required"`

#### TC-084 — Upsert creates if not exists
- **Priority**: P2
- **Route**: `PUT /api/data/settings/newkey`
- **Body**: `{ "value": "test" }`
- **Expected**: HTTP 200, new document created with `key = "newkey"`


---

## 8. Middleware Tests

### 8.1 Auth Middleware (`/middleware/auth.js`)

#### TC-085 — Missing Authorization header → 401
- **Route**: `GET /api/auth/me` (no header)
- **Priority**: P0
- **Expected**: HTTP 401, `"Not authenticated."`

#### TC-086 — Wrong Authorization scheme → 401
- **Route**: `GET /api/auth/me` with `Authorization: Basic abc123`
- **Priority**: P1
- **Expected**: HTTP 401, `"Not authenticated."`

#### TC-087 — Tampered token → 401
- **Route**: `GET /api/auth/me` with `Authorization: Bearer <valid_token_with_1_char_changed>`
- **Priority**: P0
- **Expected**: HTTP 401, `"Invalid or expired token."`

#### TC-088 — Valid token sets req.userId
- **Priority**: P0
- **Steps**: Login, use token for GET /api/auth/me
- **Expected**: HTTP 200, user returned matching token's subject claim

### 8.2 Rate Limiting (`dynamicRoutes.js`)

#### TC-089 — Under rate limit passes through
- **Priority**: P1
- **Steps**: Make 99 requests to GET /api/data/menu within 1 minute
- **Expected**: All return HTTP 200

#### TC-090 — Over rate limit returns 429
- **Priority**: P1
- **Steps**: Make 101+ requests to GET /api/data/menu within 1 minute from same IP
- **Expected**: 101st+ request returns HTTP 429, `"Too many requests. Please try again later."`

### 8.3 XSS Sanitization (`dynamicRoutes.js`)

#### TC-091 — Script tag in body is stripped
- **Priority**: P0
- **Body**: `{ "name": "<script>alert('xss')</script>Clean Name", "price": 50 }` → POST /api/data/menu
- **Expected**: Saved `name = "Clean Name"`, no script tag persisted

#### TC-092 — String fields trimmed
- **Priority**: P2
- **Body**: `{ "name": "  Padded Name  ", "price": 100 }` → POST /api/data/menu
- **Expected**: Saved `name = "Padded Name"` (leading/trailing spaces removed)

### 8.4 MongoDB Connection (`server.js`)

#### TC-093 — Connection cached across requests
- **Priority**: P1
- **Steps**: Make 5 consecutive requests to /api/health
- **Expected**: All return `"mongodb": "connected"` without reconnection delay; server logs show "MongoDB Connected" only once per process lifecycle

#### TC-094 — Missing MONGODB_URI degrades gracefully
- **Priority**: P2
- **Steps**: Deploy without MONGODB_URI env var
- **Expected**: Server starts, `/api/health` returns HTTP 200 with `"mongodb": "disconnected"`, DB endpoints return 500 with meaningful error


---

## 9. Security Tests

#### TC-095 — SQL/NoSQL injection in query params
- **Priority**: P0
- **Route**: `GET /api/data/menu?page[$gt]=0`
- **Expected**: HTTP 200 with normal pagination behavior OR 400 — NOT a DB dump or crash

#### TC-096 — NoSQL injection in body
- **Priority**: P0
- **Body**: `{ "email": { "$gt": "" }, "password": "anything" }` → POST /api/auth/login
- **Expected**: HTTP 400 or 401 — NOT a successful login bypassing auth

#### TC-097 — Large payload rejected
- **Priority**: P1
- **Steps**: Send body > 10MB to any POST endpoint
- **Expected**: HTTP 413 (Payload Too Large)

#### TC-098 — Password never returned in any response
- **Priority**: P0
- **Tests**: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, GET /api/auth/users
- **Expected**: None of the responses include a `password` field

#### TC-099 — JWT uses correct secret
- **Priority**: P1
- **Steps**: Decode JWT from login, verify signature with `JWT_SECRET` env var value
- **Expected**: Signature valid; a token signed with a different secret is rejected with 401

---

## 10. Data Model Validation

### Order Model

#### TC-100 — Status enum enforced
- **Priority**: P1
- **Steps**: PUT /api/orders/:id with `{ "status": "InvalidStatus" }`
- **Expected**: HTTP 500, Mongoose validation error

#### TC-101 — Items array item requires name, quantity, price
- **Priority**: P1
- **Steps**: POST /api/orders with `"items": [{ "name": "Chai" }]` (missing quantity and price)
- **Expected**: HTTP 500, Mongoose validation error

### User Model

#### TC-102 — Email uniqueness enforced at DB level
- **Priority**: P0
- **Steps**: Insert 2 users with same email
- **Expected**: Second insert fails with duplicate key error, HTTP 409 from controller

#### TC-103 — Password minimum length (6)
- **Priority**: P1
- **Steps**: POST /api/auth/register with `"password": "abc"` (3 chars)
- **Expected**: HTTP 500 or 400, Mongoose validation error

---

## 11. Integration Scenarios

These test multiple endpoints working together as a real flow.

### INT-01 — Full order lifecycle
- **Priority**: P0
- **Steps**:
  1. `POST /api/orders` → get `orderId`, status = `Pending`
  2. `GET /api/orders` → order present in list
  3. `PUT /api/orders/:orderId` `{ "status": "Preparing" }` → `Preparing`
  4. `PUT /api/orders/:orderId` `{ "status": "Completed" }` → `Completed`
  5. `GET /api/orders/:orderId` → final state = `Completed`
  6. `GET /api/activities` → activity log contains order entry
- **Expected**: Each step returns success, final state persisted

### INT-02 — Full auth lifecycle
- **Priority**: P0
- **Steps**:
  1. `POST /api/auth/register` → get `token1`, `userId`
  2. `POST /api/auth/login` (same credentials) → get `token2`
  3. `GET /api/auth/me` with `token2` → returns correct user
  4. `POST /api/auth/register` (same email) → 409
- **Expected**: All steps succeed in order

### INT-03 — Menu full CRUD
- **Priority**: P0
- **Steps**:
  1. `POST /api/data/menu` → creates item, get `itemId`
  2. `GET /api/data/menu` → item present
  3. `PUT /api/data/menu/:itemId` `{ "price": 999 }` → price updated
  4. `GET /api/data/menu` → updated price reflected
  5. `DELETE /api/data/menu/:itemId` → deleted
  6. `GET /api/data/menu` → item no longer present
- **Expected**: All 6 steps succeed, DB state correct at each stage

### INT-04 — Reservation flow admin confirmation
- **Priority**: P0
- **Steps**:
  1. `POST /api/data/reservations` → creates with `status: "pending"`
  2. `GET /api/data/reservations` → reservation present
  3. `PUT /api/data/reservations/:id` `{ "status": "confirmed" }` → confirmed
  4. `PUT /api/data/reservations/:id` `{ "status": "cancelled" }` → cancelled
- **Expected**: Status transitions work in sequence

### INT-05 — Settings upsert and retrieval
- **Priority**: P1
- **Steps**:
  1. `PUT /api/data/settings/hours` `{ "value": [...hours] }` → creates setting
  2. `GET /api/data/settings/hours` → returns value
  3. `PUT /api/data/settings/hours` `{ "value": [...new_hours] }` → updates
  4. `GET /api/data/settings/hours` → returns new value
- **Expected**: No duplicate documents created (upsert behavior)

---

## 12. Test Execution Order (Priority Matrix)

### P0 — Run first, must all pass

| # | Test |
|---|------|
| 1 | TC-001 Health check + MongoDB connected |
| 2 | TC-008 Register user |
| 3 | TC-012 Duplicate email rejected |
| 4 | TC-013 Password hashed in DB |
| 5 | TC-014 Login success |
| 6 | TC-015 Wrong password rejected |
| 7 | TC-019 /me with valid token |
| 8 | TC-020 /me without token → 401 |
| 9 | TC-023 Password never in response |
| 10 | TC-025 Create order |
| 11 | TC-030 Activity logged after order |
| 12 | TC-031 Get all orders |
| 13 | TC-037 Update status Preparing |
| 14 | TC-039 Update status Cancelled + message |
| 15 | TC-052 Get menu items |
| 16 | TC-060 Create menu item |
| 17 | TC-069 XSS script stripped |
| 18 | TC-070 Update menu item |
| 19 | TC-076 Delete menu item |
| 20 | TC-064 Create reservation |
| 21 | TC-071 Confirm reservation |
| 22 | TC-085 Auth middleware — no header |
| 23 | TC-087 Tampered token rejected |
| 24 | TC-096 NoSQL injection blocked |
| 25 | TC-098 Password never in response |
| 26 | TC-102 Email uniqueness at DB level |
| 27 | INT-01 Full order lifecycle |
| 28 | INT-02 Full auth lifecycle |
| 29 | INT-03 Menu full CRUD |
| 30 | INT-04 Reservation flow |

### P1 — Run after P0 passes

TC-009 to TC-011, TC-016 to TC-018, TC-021 to TC-022, TC-027 to TC-029, TC-032, TC-035, TC-042, TC-056 to TC-058, TC-061 to TC-063, TC-065 to TC-066, TC-074 to TC-075, TC-077 to TC-078, TC-083 to TC-086, TC-089 to TC-091, TC-095, TC-097, TC-099 to TC-101, TC-103, INT-05

### P2/P3 — Non-blocking

TC-024, TC-033, TC-048, TC-057, TC-068, TC-080, TC-084, TC-092, TC-094

---

## 13. Acceptance Criteria

The backend is production-ready when:

- [ ] All P0 test cases pass
- [ ] All P1 test cases pass
- [ ] `GET /api/health` returns `"mongodb": "connected"`
- [ ] No plaintext passwords anywhere in API responses
- [ ] XSS script tags stripped from all string inputs
- [ ] Rate limiter returns 429 after 100 req/min
- [ ] JWT tamper returns 401 (not 200 or 500)
- [ ] Order status transitions persist correctly in MongoDB Atlas
- [ ] Activity log entry created for every new order
- [ ] All CRUD operations on all 4 dynamic resources work end-to-end
- [ ] Settings upsert creates on first call, updates on subsequent calls

---

## 14. Quick Test Commands (PowerShell / curl)

```powershell
# Health check
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/health"

# Register
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/auth/register" -Method POST -Body '{"name":"Test","email":"t@t.com","phone":"9999999999","password":"Test@1234"}' -ContentType "application/json"

# Login
$r = Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/auth/login" -Method POST -Body '{"email":"t@t.com","password":"Test@1234"}' -ContentType "application/json"
$token = $r.token

# Get me (protected)
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/auth/me" -Headers @{ Authorization = "Bearer $token" }

# Create order
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/orders" -Method POST -Body '{"customerName":"Test","customerEmail":"t@t.com","customerPhone":"9999999999","address":"Delhi","paymentMethod":"cod","items":[{"name":"Chai","quantity":1,"price":75}],"totalAmount":115}' -ContentType "application/json"

# Get all orders
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/orders"

# Get menu
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/data/menu"

# XSS test
Invoke-RestMethod "https://cafe-backend-azure.vercel.app/api/data/menu" -Method POST -Body '{"name":"<script>alert(1)</script>Safe","price":100}' -ContentType "application/json"
```

---

*Document created: 2026-06-27*  
*Project: Raj's Cafe — github.com/rajmohite00/cafe*  
*Companion document: docs/frontend-testing-prd.md*
