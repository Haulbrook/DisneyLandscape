# Playwright Test Suite Handoff

## Project Overview

**Site:** Disney Landscape Studio
**Stack:** React 18 + Vite 5, Tailwind CSS, Supabase Auth, Netlify Functions, Stripe
**Test Framework:** Playwright
**Test Run Date:** December 2024

---

## Test Suite Structure

```
tests/
├── fixtures/
│   └── test-fixtures.ts      # Shared helpers, test users, utilities
├── auth/
│   ├── auth.setup.ts         # Pre-authenticates and saves session state
│   ├── login.spec.ts         # 12 login flow tests
│   ├── signup.spec.ts        # 10 signup flow tests
│   └── password-reset.spec.ts # 7 password reset tests
├── chaos/
│   └── session-chaos.spec.ts # 12 session chaos tests
├── routes/
│   └── protected-routes.spec.ts # 13 route protection tests
├── subscription/
│   └── tier-limits.spec.ts   # 14 subscription tier tests
├── stress/
│   └── api-stress.spec.ts    # 10 API stress tests
├── .auth/                    # Saved auth state (gitignored)
├── .env.example              # Template for test credentials
└── .gitignore
```

---

## Test Categories

### 1. Authentication Tests (`tests/auth/`)

**login.spec.ts** - 12 tests
- Valid credentials login
- Invalid email/password handling
- Empty field validation
- Remember me functionality
- Login button state during submission
- Error message display
- Modal close behavior
- Session persistence after login

**signup.spec.ts** - 10 tests
- New user registration
- Duplicate email handling
- Password mismatch validation
- Weak password rejection
- Email format validation
- Terms acceptance requirement
- Success redirect flow

**password-reset.spec.ts** - 7 tests
- Reset email request
- Invalid email handling
- Success message display
- Rate limiting behavior

### 2. Session Chaos Tests (`tests/chaos/session-chaos.spec.ts`) - 12 tests

- Multi-tab session sync
- Concurrent login from different browsers
- Session persistence after network disconnect
- Token refresh during long sessions
- Logout propagation across tabs
- Session recovery after browser crash
- Rapid login/logout cycles
- Stale token handling

### 3. Protected Routes (`tests/routes/protected-routes.spec.ts`) - 13 tests

- `/account` redirect when unauthenticated
- `/studio` access for authenticated users
- Deep link preservation after login
- Role-based access control
- Direct URL access attempts

### 4. Subscription Tiers (`tests/subscription/tier-limits.spec.ts`) - 14 tests

- Free tier limitations (3 plants, watermark)
- Basic tier limits ($15 - 12 plants, warning at limit)
- Pro tier limits ($49 - 50 plants)
- Max tier limits ($149.99 - unlimited)
- Upgrade prompts display
- Feature gating per tier

### 5. API Stress Tests (`tests/stress/api-stress.spec.ts`) - 10 tests

- Sequential login performance (avg: 1000-1500ms)
- Page load times (2-11 seconds)
- Concurrent user simulation
- Rate limit behavior
- Error recovery under load

---

## Test Results Summary

**Last Run:** 416 tests across 8 browser configurations

| Status | Count | Percentage |
|--------|-------|------------|
| Passed | 270   | 65%        |
| Failed | 146   | 35%        |

**Runtime:** 16.6 minutes

**Browser Configurations Tested:**
- Chromium (desktop)
- Firefox (desktop)
- WebKit (desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Stress (Chromium with extended timeouts)

---

## Known Failures & Fixes Needed

### Issue 1: Strict Mode Violations (Priority: HIGH)

**Problem:** Selectors match multiple elements, causing Playwright strict mode to fail.

**Examples:**
```
Error: locator.click: Error: strict mode violation: locator('button:has-text("Sign In")') resolved to 3 elements
```

**Affected Tests:** ~40% of failures

**Fix:**
```typescript
// BEFORE (matches nav button, modal tab, AND submit button)
page.locator('button:has-text("Sign In")')

// AFTER (specific to context)
page.locator('button[type="submit"]:has-text("Sign In")')
// or
page.locator('.modal button:has-text("Sign In")')
// or
page.locator('[data-testid="login-submit"]')  // requires adding data-testid to component
```

**Files to Update:**
- `tests/auth/login.spec.ts`
- `tests/auth/signup.spec.ts`
- `tests/chaos/session-chaos.spec.ts`

---

### Issue 2: Modal Backdrop Intercepting Clicks (Priority: HIGH)

**Problem:** The modal's backdrop (`fixed inset-0 bg-black/50`) intercepts click events meant for elements behind it.

**Error:**
```
Error: locator.click: <div class="fixed inset-0 bg-black/50..."> intercepts pointer events
```

**Affected Tests:** ~25% of failures

**Fix:**
```typescript
// BEFORE
await page.click('button:has-text("Get Started")');

// AFTER - wait for modal to close first
await page.waitForSelector('.fixed.inset-0', { state: 'hidden' });
await page.click('button:has-text("Get Started")');

// OR - use force click when appropriate
await page.click('button:has-text("Get Started")', { force: true });
```

**Files to Update:**
- `tests/routes/protected-routes.spec.ts`
- `tests/subscription/tier-limits.spec.ts`

---

### Issue 3: CSS Selector Syntax Errors (Priority: MEDIUM)

**Problem:** Some selectors mix CSS syntax with Playwright's text matching incorrectly.

**Error:**
```
Error: Unsupported token "Sign" while parsing selector
```

**Fix:**
```typescript
// BEFORE (invalid - can't mix CSS pseudo-selectors with text)
page.locator('input[type="password"]:first-of-type')

// AFTER
page.locator('input[type="password"]').first()
```

**Files to Update:**
- `tests/auth/signup.spec.ts`
- `tests/fixtures/test-fixtures.ts`

---

### Issue 4: Concurrent Login Rate Limiting (Priority: LOW)

**Problem:** Supabase rate limits rapid authentication attempts, causing 0% success on concurrent tests.

**Metrics:**
- 10 concurrent logins: 0% success
- Sequential logins: 100% success

**Fix Options:**

1. **Add delays between concurrent attempts:**
```typescript
// Stagger login attempts
for (let i = 0; i < users.length; i++) {
  await page.waitForTimeout(500 * i); // 500ms stagger
  await loginUser(users[i]);
}
```

2. **Use different test accounts:**
```typescript
// Create multiple test users to avoid rate limits on single account
const TEST_USERS_POOL = [
  { email: 'test1@example.com', password: 'pass1' },
  { email: 'test2@example.com', password: 'pass2' },
  // ...
];
```

3. **Accept rate limiting as valid behavior:**
```typescript
// Test that rate limiting WORKS correctly
test('should rate limit rapid login attempts', async ({ page }) => {
  // Expect failure after N attempts
  await expect(loginAttempt).rejects.toThrow(/rate limit/i);
});
```

**Files to Update:**
- `tests/stress/api-stress.spec.ts`
- `tests/chaos/session-chaos.spec.ts`

---

### Issue 5: Missing UI Elements (Priority: MEDIUM)

**Problem:** Some tests expect UI elements that don't exist or have different selectors.

**Examples:**
- Looking for `[data-testid="error-message"]` but app uses `.text-red-500`
- Expecting "Remember me" checkbox that may not exist
- Looking for specific tier badges that have different class names

**Fix:** Audit each failing test against actual component markup and update selectors.

---

## Planned Fixes Implementation Order

1. **Phase 1: Selector Fixes** (Fixes ~65% of failures)
   - Add `.first()` or `.nth()` to ambiguous selectors
   - Use more specific parent selectors (`.modal`, `form`, etc.)
   - Add `data-testid` attributes to key interactive elements

2. **Phase 2: Modal Handling** (Fixes ~25% of failures)
   - Add explicit waits for modal close/open states
   - Create helper function `waitForModalClosed()`
   - Use `{ force: true }` where appropriate

3. **Phase 3: Stress Test Tuning** (Fixes ~10% of failures)
   - Add staggered timing to concurrent tests
   - Reduce concurrent user count to 5
   - Add rate limit detection and graceful handling

---

## EXPANDED TEST COVERAGE (Completed)

### New Test Files Added

#### Studio Features (`tests/studio/`)
- [x] `studio-core.spec.ts` - Page layout, plant search/filtering, zoom controls, bed config, tabs
- [x] `plant-placement.spec.ts` - Plant selection, canvas placement, multi-select, undo/redo
- [x] `bundles-scoring.spec.ts` - Bundle application, Disney/Residential scores, bloom calendar
- [x] `export-vision.spec.ts` - Export blueprint, Vision preview modal, save design
- [x] `image-generation.spec.ts` - Vision modal UI, API integration, season selection, portfolio

#### Payment/Subscription (`tests/payments/`)
- [x] `checkout-flow.spec.ts` - Pricing display, all 5 tiers, checkout session, Stripe redirect
- [x] `subscription-management.spec.ts` - Customer portal, usage tracking, upgrade prompts, webhooks

#### Landing Page (`tests/landing/`)
- [x] `landing-core.spec.ts` - Page structure, nav, hero, demo section, features, footer
- [x] `landing-responsive.spec.ts` - Mobile/tablet/desktop viewports, hover states, smooth scrolling

#### Account Management (`tests/account/`)
- [x] `account-page.spec.ts` - Profile display, subscription section, user dropdown, sign out

---

## NPM Scripts Available

```bash
# Run all tests
npm test

# Run with UI mode (recommended for debugging)
npm run test:ui

# Run headed (see browser)
npm run test:headed

# Run stress tests only
npm run test:stress

# Run specific test file
npm test -- tests/auth/login.spec.ts

# Run tests matching pattern
npm test -- --grep "login"
```

---

## Environment Setup

Required in `.env`:
```
VITE_SUPABASE_URL=https://qnzzvmriclyifdqyxazp.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Optional: Override test credentials
TEST_USER_EMAIL=thaulbrook@gmail.com
TEST_USER_PASSWORD=Sweettrick22
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Main config, browser projects, timeouts |
| `tests/fixtures/test-fixtures.ts` | Shared helpers, TEST_USERS, auth utilities |
| `tests/auth/auth.setup.ts` | Creates authenticated session for reuse |
| `tests/.auth/user.json` | Saved auth state (gitignored) |

---

## Next Steps

1. Fix the 146 failing tests using the fixes documented above
2. Add test coverage for Studio features (plant placement, canvas, export)
3. Add test coverage for Stripe checkout/subscription flows
4. Add test coverage for image generation via Replicate
5. Add visual regression tests for key pages
6. Set up CI/CD integration (GitHub Actions recommended)
