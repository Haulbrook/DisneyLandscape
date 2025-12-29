import { test as base, expect, Page, BrowserContext } from '@playwright/test';

// Test user credentials - use environment variables or test accounts
export const TEST_USERS = {
  valid: {
    email: process.env.TEST_USER_EMAIL || 'thaulbrook@gmail.com',
    password: process.env.TEST_USER_PASSWORD || 'Sweettrick22',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'haulbrookai@gmail.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'Sweettrick22',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  newUser: {
    email: `test-${Date.now()}@example.com`,
    password: 'newuserpassword123',
    fullName: 'Test User',
  },
};

// Extend base test with custom fixtures
export const test = base.extend<{
  authenticatedPage: Page;
  authContext: BrowserContext;
}>({
  // Fixture: Pre-authenticated page
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './tests/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Fixture: Auth context for multi-tab tests
  authContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
});

export { expect };

// Helper: Wait for auth modal to appear
export async function openAuthModal(page: Page, action: 'signin' | 'signup' = 'signin') {
  // Click the Sign In button in the nav
  const signInButton = page.locator('button:has-text("Sign In")').first();
  await signInButton.click();

  // Wait for the modal backdrop (fixed inset-0 with bg-black/50)
  await page.waitForSelector('.fixed.inset-0, h2:has-text("Welcome Back"), h2:has-text("Create Account")', { timeout: 5000 });

  // Switch to appropriate tab if needed
  if (action === 'signup') {
    const signupTab = page.locator('button:has-text("Create Account")').first();
    if (await signupTab.isVisible()) {
      await signupTab.click();
      await page.waitForTimeout(300); // Wait for tab switch
    }
  }
}

// Helper: Fill login form
export async function fillLoginForm(page: Page, email: string, password: string) {
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
}

// Helper: Fill signup form
export async function fillSignupForm(
  page: Page,
  email: string,
  password: string,
  confirmPassword: string,
  fullName?: string
) {
  await page.fill('input[type="email"], input[name="email"]', email);

  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.first().fill(password);

  if (await passwordInputs.count() > 1) {
    await passwordInputs.nth(1).fill(confirmPassword);
  }

  if (fullName) {
    const nameInput = page.locator('input[name="fullName"], input[name="name"], input[placeholder*="name" i]');
    if (await nameInput.isVisible()) {
      await nameInput.fill(fullName);
    }
  }
}

// Helper: Submit auth form
export async function submitAuthForm(page: Page) {
  // Target the submit button inside the modal (has bg-sage-600 and type="submit")
  const submitButton = page.locator('button[type="submit"].bg-sage-600');
  await submitButton.click();
}

// Helper: Wait for successful login
export async function waitForLogin(page: Page, timeout = 10000) {
  // Wait for the modal to close and user menu to appear
  // The user menu shows the username (email prefix) after login
  await page.waitForSelector('.w-8.h-8.bg-sage-500.rounded-full, button:has-text("Sign Out")', {
    timeout,
    state: 'visible'
  }).catch(() => {
    // Alternative: check if Sign In button is gone
  });

  // Also wait a moment for auth state to settle
  await page.waitForTimeout(500);
}

// Helper: Check if user is authenticated
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check for the user avatar button (shows when logged in)
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full');
    const signOutVisible = page.locator('button:has-text("Sign Out")');
    const signInButton = page.locator('button:has-text("Sign In")');

    // If Sign In button is visible, not authenticated
    if (await signInButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      return false;
    }

    // If user avatar or sign out is visible, authenticated
    const hasAvatar = await userAvatar.isVisible({ timeout: 2000 }).catch(() => false);
    return hasAvatar;
  } catch {
    return false;
  }
}

// Helper: Logout
export async function logout(page: Page) {
  // Click on the user menu (the avatar/username area)
  const userMenuButton = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();
  if (await userMenuButton.isVisible()) {
    await userMenuButton.click();
    await page.waitForTimeout(300);

    // Click Sign Out in dropdown
    await page.click('button:has-text("Sign Out")');
    await page.waitForSelector('button:has-text("Sign In")', { timeout: 5000 });
  }
}

// Helper: Generate random email
export function randomEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

// Helper: Measure response time
export async function measureResponseTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
}

// Helper: Close any open modals (fixes backdrop intercept issues)
export async function closeAnyOpenModals(page: Page) {
  const backdrop = page.locator('.fixed.inset-0.bg-black\\/50, [class*="modal-backdrop"], .fixed.inset-0[class*="bg-black"]');
  if (await backdrop.isVisible({ timeout: 1000 }).catch(() => false)) {
    // Try close button first
    const closeBtn = page.locator('button:has-text("×"), button[aria-label*="close"], button[aria-label*="Close"], .modal button:has-text("Cancel")').first();
    if (await closeBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await closeBtn.click();
    } else {
      // Press Escape to close modal
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
  }
}

// Helper: Wait for modal to be hidden before clicking
export async function waitForModalHidden(page: Page, timeout = 5000) {
  await page.waitForSelector('.fixed.inset-0', { state: 'hidden', timeout }).catch(() => {});
}

// Helper: Generate unique test email (more unique for signup tests)
export function generateUniqueEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}
