# Testing Guide - World Cup Tix

## Development Server
✅ **Server is running on**: http://localhost:8080/

## Complete User Flow Testing

### 1. Home Page (/)
**What to test:**
- [ ] Hero section displays correctly with World Cup 2026 branding
- [ ] Stats strip shows: 104 Matches, 48 Nations, 16 Host cities, $60+ Starting price
- [ ] Featured fixtures section displays correctly
- [ ] All navigation links work
- [ ] "Browse all matches" button navigates to /matches
- [ ] "See featured fixtures" scrolls to featured section

### 2. All Matches Page (/matches)
**What to test:**
- [ ] All 24+ matches display correctly
- [ ] Search functionality works (try searching for "Brazil", "USA", "England")
- [ ] Stage filter works (Group Stage, Round of 32, etc.)
- [ ] Match cards show correct information:
  - Team names and flags
  - Date and time
  - Venue and city
  - Starting price
- [ ] "Get tickets →" button on each card navigates to match detail page

### 3. Match Detail Page (/matches/[matchId])
**Test with multiple matches:**

#### Example: Mexico vs South Africa (wc26-01)
- [ ] Match information displays correctly:
  - Teams: Mexico 🇲🇽 vs South Africa 🇿🇦
  - Date: Thu, Jun 11, 2026
  - Venue: Estadio Azteca — Mexico City, Mexico
  - Stage: Group Stage
  
- [ ] Ticket categories display correctly:
  - Cat1: $555 (Premium seats)
  - Cat2: $315 (Lower tier)
  - Cat3: $160 (Mid-tier)
  - Cat4: $60 (Upper tier)

- [ ] Quantity selectors work:
  - [ ] Can increase quantity (+ button)
  - [ ] Can decrease quantity (- button)
  - [ ] Maximum 8 tickets per category
  - [ ] Order summary updates in real-time

- [ ] Buttons work correctly:
  - [ ] "Checkout with BTC →" navigates to checkout with items
  - [ ] "Add to cart" adds items and resets quantities

#### Example: USA vs Paraguay (wc26-04)
- [ ] Teams: USA 🇺🇸 vs Paraguay 🇵🇾
- [ ] Venue: SoFi Stadium — Los Angeles, USA
- [ ] Date: Fri, Jun 12, 2026

#### Example: Brazil vs Morocco (wc26-06)
- [ ] Teams: Brazil 🇧🇷 vs Morocco 🇲🇦
- [ ] Venue: MetLife Stadium — New York/New Jersey, USA
- [ ] Date: Sat, Jun 13, 2026

### 4. Checkout Page (/checkout)
**What to test:**

#### Cart Display
- [ ] All selected tickets display correctly
- [ ] Can update quantities using +/- buttons
- [ ] Can remove items by reducing quantity to 0
- [ ] Prices calculate correctly

#### Buyer Details Form
- [ ] Full name field:
  - [ ] Required validation works
  - [ ] Minimum 2 characters
  - [ ] Error message displays for invalid input

- [ ] Email field:
  - [ ] Required validation works
  - [ ] Email format validation works
  - [ ] Error message displays for invalid email

#### Bitcoin Payment Section
- [ ] Amount due displays correctly in BTC and USD
- [ ] Merchant BTC address displays: `bc1qxnvqnsq9espec2ahsnkzdl3jqxtgsdveu6rzqv`
- [ ] Copy button works (copies address to clipboard)
- [ ] Payment instructions are clear

#### Order Summary (Right Sidebar)
- [ ] Subtotal calculates correctly
- [ ] Service fee (12%) calculates correctly
- [ ] Mobile delivery fee ($4.50) displays
- [ ] Total in USD displays correctly
- [ ] Total in BTC displays correctly

#### Form Submission
- [ ] Cannot submit with empty fields
- [ ] Validation errors display correctly
- [ ] Submit button shows "Processing order…" during submission
- [ ] Redirects to confirmation page after successful submission

### 5. Confirmation Page (/confirmation)
**What to test:**
- [ ] Success message displays with checkmark
- [ ] Order ID displays (format: WCT-XXXXXX)
- [ ] Email confirmation message shows correct email
- [ ] All tickets display correctly with:
  - Team names
  - Stage
  - Venue
  - Date
  - Category
  - Quantity
  - Price

#### Payment Details
- [ ] Payment method shows "Bitcoin (BTC)"
- [ ] Merchant BTC address displays (shortened and full)
- [ ] Full address: `bc1qxnvqnsq9espec2ahsnkzdl3jqxtgsdveu6rzqv`
- [ ] Amount in BTC displays correctly
- [ ] USD equivalent displays correctly

#### Delivery Information
- [ ] Email address displays correctly
- [ ] Delivery instructions are clear

#### Navigation
- [ ] "Back to home" button works
- [ ] "Browse more matches" button works

### 6. Cart Functionality
**Test cart persistence:**
- [ ] Add items from one match
- [ ] Navigate to another match
- [ ] Add more items
- [ ] Cart count in header updates correctly
- [ ] Click cart icon in header
- [ ] All items display in checkout
- [ ] Cart persists on page refresh (sessionStorage)

### 7. Navigation & Header
**What to test:**
- [ ] Logo links to home page
- [ ] "Home" link works
- [ ] "Matches" link works
- [ ] Cart icon shows correct count
- [ ] Cart count updates when items are added
- [ ] Active link highlighting works

### 8. Footer
**What to test:**
- [ ] All footer content displays correctly
- [ ] Disclaimer is visible
- [ ] Current year displays correctly

### 9. Responsive Design
**Test on different screen sizes:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Check:**
- [ ] Navigation collapses appropriately
- [ ] Match cards stack correctly
- [ ] Checkout layout adapts
- [ ] Forms are usable on mobile

### 10. Edge Cases
**Test error scenarios:**
- [ ] Navigate to non-existent match ID (should show 404)
- [ ] Try to checkout with empty cart (should show empty cart message)
- [ ] Try to submit checkout form with invalid data
- [ ] Refresh confirmation page (should still show order if in session)

## Sample Test Scenarios

### Scenario 1: Complete Purchase Flow
1. Go to home page
2. Click "Browse all matches"
3. Search for "Brazil"
4. Click on Brazil vs Morocco match
5. Select 2 tickets in Cat2 ($315 each)
6. Select 1 ticket in Cat4 ($60)
7. Click "Checkout with BTC →"
8. Fill in name: "John Doe"
9. Fill in email: "john@example.com"
10. Verify BTC address displays correctly
11. Click "Confirm order"
12. Verify confirmation page shows all details correctly

### Scenario 2: Multiple Matches
1. Go to matches page
2. Add tickets from USA vs Paraguay
3. Click "Add to cart"
4. Go back to matches
5. Add tickets from England vs Croatia
6. Click "Add to cart"
7. Click cart icon in header
8. Verify both matches are in cart
9. Complete checkout

### Scenario 3: Cart Management
1. Add tickets from any match
2. Go to checkout
3. Increase quantity of one item
4. Decrease quantity of another
5. Remove an item completely (reduce to 0)
6. Verify totals update correctly
7. Complete checkout

## Expected Results

### Pricing Examples
**Group Stage Match (e.g., Mexico vs South Africa):**
- Cat1: $555
- Cat2: $315
- Cat3: $160
- Cat4: $60

**Example Order:**
- 2x Cat2 tickets: $630
- Service fee (12%): $75.60
- Delivery: $4.50
- **Total: $710.10**
- **BTC (at $95,000/BTC): ₿ 0.007475**

### Bitcoin Address
**Merchant Address:** `bc1qxnvqnsq9espec2ahsnkzdl3jqxtgsdveu6rzqv`

## Known Limitations (Demo Mode)
- No actual Bitcoin transactions occur
- BTC rate is fixed at $95,000 for demo purposes
- No real ticket delivery
- Order data stored in sessionStorage only
- No backend/database integration

## Browser Compatibility
Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Checks
- [ ] Page loads quickly
- [ ] No console errors
- [ ] No console warnings
- [ ] Images load properly
- [ ] Smooth transitions and animations
- [ ] No layout shifts

## Accessibility Checks
- [ ] All buttons have proper labels
- [ ] Form inputs have labels
- [ ] Error messages are clear
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## Report Issues
If you find any issues during testing, note:
1. What you were doing
2. What you expected to happen
3. What actually happened
4. Browser and device information
5. Any console errors
