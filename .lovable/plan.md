# Ticketmaster Research & React MVP Plan

## Part 1 — How Ticketmaster Actually Operates

### The business model (who owns what)
- Ticketmaster does **not** own tickets. Event Organizers (teams, venues, promoters, artists) own inventory and set prices, on‑sale dates, seat maps, and resale rules.
- Ticketmaster is the **distribution + transaction layer**: hosts inventory, runs the sale, handles payments, fights bots/fraud, delivers tickets (mobile/SafeTix), and powers resale.
- Revenue: service fees, order processing, facility fees (shared w/ venue), delivery fees, and a cut of resale.

### The lifecycle of a ticket
1. **Event creation (Publish side)** — Organizer uses Host / Archtics / TM1 (internal tools) to define event, venue map, price levels, holds, presales, fees, on‑sale time.
2. **Discovery** — Event published to ticketmaster.com + partner channels via the public **Discovery API** (events, venues, attractions, classifications).
3. **Queue / Verified Fan / Presale** — High-demand sales route fans through a virtual waiting room (Queue-it style) and identity verification (Verified Fan) before any inventory call.
4. **Seat selection & hold** — UI calls **Availability API** (Partner) to fetch real-time seat map + offers. Selecting a seat creates a short-lived **reserve/hold** (TTL ~minutes) — distributed lock prevents double-booking.
5. **Cart & checkout** — **Commerce API / Purchase API** handles cart, applies promo/offer codes, computes fees, runs payment (Stripe-like processors), bot checks (reCAPTCHA, device fingerprint, Queue-it token).
6. **Fulfillment** — Ticket issued as mobile barcode (SafeTix = rotating barcode every ~15s to kill screenshots), PDF, or will-call. Stored in user's "My Tickets".
7. **Resale / Transfer** — Owner lists on **Face Value Exchange** (capped at face) or standard resale (market price, fees both sides). Transfer = peer-to-peer reassignment via email/phone.
8. **Entry** — Venue scans rotating barcode; ticket is invalidated server-side immediately.

### Public/Partner API surface (what's actually documented)
| API | Access | Purpose |
|---|---|---|
| **Discovery API** v2 | Public (API key) | Search events, venues, attractions, classifications, images. JSON+HAL. Rate-limited (5k/day default). |
| **Commerce API** | Restricted | Cart, offers, pricing, checkout. |
| **Publish API** | Restricted | Push 3rd-party event data into TM. |
| **Partner API** (Availability, Reserve, Cart, Checkout, Order) | Contract only | Full purchase flow embedded in partner sites. |
| **Inventory Status API** | Restricted | Real-time on-sale/availability flags. |
| **Top Picks, Season Ticketing, International Discovery, Presence SDK, Purchase SDK** | Mixed | Personalization, season plans, embedded purchase UI. |

For an MVP you can only realistically use the **Discovery API** (free key from developer.ticketmaster.com). Everything write-side (cart/checkout/seat hold) needs a partner contract — so the MVP **simulates** that layer.

### System-design highlights (why TM doesn't melt)
- **Read/write split**: catalog (events) is heavily cached/CDN'd; inventory is the hot path.
- **Seat-hold service**: in-memory store (Redis) with TTL keys per seat; optimistic locking + atomic `SETNX`.
- **Queue / waiting room**: offloads stampede before it hits inventory; issues signed tokens with a slot timestamp.
- **Idempotency keys** on cart/checkout to survive retries.
- **Event-driven**: Kafka topics for "seat reserved", "order placed", "ticket transferred" → analytics, fraud, email, barcode service.
- **Sharding**: inventory sharded by event_id (one hot event ≈ one shard hot-spotted, mitigated by per-section sub-sharding).
- **Bot defense**: Verified Fan, Queue-it, device fingerprint, behavioral CAPTCHA, rate limits per IP/account.
- **Rotating barcode (SafeTix)**: server issues short-lived signed barcodes via mobile SDK push.

---

## Part 2 — React MVP Plan (don't build yet)

### Scope of the MVP
A "mini Ticketmaster" that demonstrates the full lifecycle end-to-end, using **real event data from Discovery API** + **simulated inventory/checkout** (since write APIs are gated).

Core user stories:
1. Browse & search live events (real data).
2. View event detail + venue + seat map (simulated grid for MVP).
3. Pick seats → 5-minute hold → cart.
4. Mock checkout (no real payment, or Stripe test mode).
5. "My Tickets" with a fake rotating QR barcode.
6. List ticket for resale / transfer to another user.
7. Auth (email/password).

### Pages / routes
```
/                     Home — featured + nearby events
/events               Search/filter (keyword, city, date, genre)
/events/$id           Event detail, venue info, "Get Tickets"
/events/$id/seats     Seat picker (simulated map) + hold timer
/cart                 Cart + mock checkout
/account              Profile
/account/tickets      My tickets (QR + transfer + resell)
/account/listings     Active resale listings
/marketplace/$id      Resale listings for an event
/login /signup
```

### Tech stack (matches this template)
- **Frontend**: React 19 + TanStack Start (already scaffolded), TanStack Query for data, Tailwind v4, shadcn/ui.
- **Backend**: Lovable Cloud (Supabase) for auth, DB, RLS, storage.
- **Server functions** (`createServerFn`): proxy Discovery API (hide API key), seat-hold logic, checkout, resale.
- **External**: Ticketmaster Discovery API (free key), optional Stripe test mode, optional Mapbox for venue maps.
- **QR**: `qrcode.react`; rotate value every 15s with HMAC of `(ticket_id, timestamp, secret)`.

### Data model (Lovable Cloud / Postgres)
```
profiles(id, display_name, phone, created_at)
events_cache(tm_id pk, name, start_utc, venue_json, image_url, fetched_at)
seat_inventory(id, event_id, section, row, seat, price_cents, status)
   status ∈ available | held | sold
seat_holds(seat_id pk, user_id, expires_at)        -- TTL row, cron sweeps
orders(id, user_id, event_id, total_cents, status, stripe_pi, created_at)
order_items(id, order_id, seat_id, price_cents)
tickets(id, order_id, seat_id, owner_id, barcode_secret, state)
   state ∈ valid | transferred | listed | redeemed
listings(id, ticket_id, seller_id, ask_cents, status)
transfers(id, ticket_id, from_id, to_email, accepted_at)
user_roles(user_id, role)   -- admin/user, separate table (security)
```
RLS: users only see their own orders/tickets/listings; events_cache is public read.

### Key server functions
- `searchEvents({ q, city, dateRange })` → Discovery API proxy + cache.
- `getEvent(id)` → Discovery + ensure `seat_inventory` seeded (generated grid for MVP).
- `holdSeats({ eventId, seatIds })` → transaction: insert into `seat_holds` if available, 5-min TTL, return holdId.
- `releaseHold` / cron job to sweep expired holds back to `available`.
- `checkout({ holdId, paymentMethod })` → verify hold still valid → create order → mint tickets → mark seats `sold`.
- `listForResale({ ticketId, askCents })`.
- `buyListing({ listingId })` → atomic transfer of ticket ownership.
- `transferTicket({ ticketId, toEmail })`.
- `rotatingBarcode({ ticketId })` → returns signed token w/ 15s expiry.

### Concurrency model (the interesting bit)
- Seat hold uses a single SQL `UPDATE seat_inventory SET status='held' WHERE id=ANY($1) AND status='available'` — only succeeds for rows that were free; report partial failure to UI.
- Hold TTL enforced by `expires_at` column + Postgres cron (`pg_cron`) every 30s sweeping expired holds.
- Checkout re-validates hold ownership + expiry inside a transaction before marking `sold`.
- Idempotency: client passes a UUID per checkout attempt; stored on `orders`.

### Build order (suggested sprints)
1. **Foundation** — auth, profiles, layout shell, Discovery API proxy + search/detail pages.
2. **Inventory + seat picker** — generated seat grid component, hold endpoint, countdown timer UI.
3. **Checkout + tickets** — mock pay, ticket issuance, My Tickets page with rotating QR.
4. **Resale + transfer** — listings, marketplace view, ownership transfer.
5. **Polish** — empty states, error boundaries, SEO per route, sitemap, basic admin (scan ticket → mark redeemed).

### What we explicitly skip (vs real TM)
- Real seat maps from venues (use a generic SVG grid).
- Real payment processing (Stripe test only).
- Queue-it style waiting room (note as future work; show how it'd slot in front of `holdSeats`).
- Verified Fan / identity, dynamic pricing, presale codes (stub flag only).
- Native mobile SafeTix SDK (web QR rotation is the analog).

### Risks / gotchas
- **Discovery API key must stay server-side** — call only from `createServerFn`.
- **Rate limits** (5k/day) — cache event responses in `events_cache` aggressively.
- **No write API access** — be explicit in the UI that purchase is simulated.
- **RLS everywhere** — tickets/orders/listings must be locked to owner; roles in separate table.

---

Ready to start building when you say go — recommend starting with sprint 1 (auth + Discovery search) so we get real event data flowing fast.
