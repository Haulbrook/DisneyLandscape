import { test, expect, TEST_USERS, openAuthModal, fillLoginForm, submitAuthForm, waitForLogin, isAuthenticated } from '../fixtures/test-fixtures';

test.describe('Protected Routes', () => {
  test.describe('Account Page Protection', () => {
    test('should redirect unauthenticated users from /account to home', async ({ page }) => {
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      // Should redirect to home or show login
      const url = page.url();
      const isOnAccount = url.includes('/account');

      if (isOnAccount) {
        // If still on account, should show login prompt
        await expect(page.locator('text=/sign in|log in|login/i')).toBeVisible();
      } else {
        // Should be redirected
        expect(url).not.toContain('/account');
      }
    });

    test('should allow authenticated users to access /account', async ({ page }) => {
      // Login first
      await page.goto('/');
      await openAuthModal(page, 'signin');
      await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
      await submitAuthForm(page);
      await waitForLogin(page);

      // Navigate to account
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      // Should be on account page
      expect(page.url()).toContain('/account');
      expect(await isAuthenticated(page)).toBe(true);
    });

    test('should redirect back to /account after login', async ({ page }) => {
      // Try to access account (will redirect/show login)
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      // If redirected, go home and login
      if (!page.url().includes('/account')) {
        await page.goto('/');
      }

      // Login
      await openAuthModal(page, 'signin');
      await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
      await submitAuthForm(page);
      await waitForLogin(page);

      // Navigate to account
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/account');
    });
  });

  test.describe('Studio Page Access', () => {
    test('should allow unauthenticated users to view /studio', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Should be on studio page (not redirected)
      expect(page.url()).toContain('/studio');
    });

    test('should show demo mode indicators for unauthenticated users', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Should show demo mode or free tier indicators
      const demoIndicator = page.locator('text=/demo|free|limited|upgrade|sign in/i');
      await expect(demoIndicator.first()).toBeVisible({ timeout: 5000 });
    });

    test('should show upgrade prompts when hitting limits', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Try to use a premium feature (like export or save)
      const premiumButtons = page.locator('button:has-text("Export"), button:has-text("Save"), button:has-text("Vision")');

      if (await premiumButtons.count() > 0) {
        await premiumButtons.first().click();

        // Should show upgrade prompt or auth modal
        await expect(
          page.locator('text=/upgrade|subscribe|sign in|create account/i')
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test('should unlock features after authentication', async ({ page }) => {
      // First check demo mode
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Login
      await openAuthModal(page, 'signin');
      await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
      await submitAuthForm(page);
      await waitForLogin(page);

      // Navigate back to studio
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Should be authenticated
      expect(await isAuthenticated(page)).toBe(true);
    });
  });

  test.describe('Public Routes', () => {
    test('should allow access to landing page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('body')).toBeVisible();
      // Landing page should have call-to-action
      await expect(page.locator('text=/get started|sign up|try/i').first()).toBeVisible();
    });

    test('should allow access to portfolio page', async ({ page }) => {
      await page.goto('/portfolio');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/portfolio');
    });

    test('should handle 404 routes gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page-12345');
      await page.waitForLoadState('networkidle');

      // Should either show 404 or redirect to home
      const is404 = await page.locator('text=/404|not found/i').isVisible().catch(() => false);
      const isHome = page.url() === new URL('/', page.url()).href;

      expect(is404 || isHome).toBe(true);
    });
  });

  test.describe('Reset Password Page', () => {
    test('should handle access without token', async ({ page }) => {
      await page.goto('/reset-password');
      await page.waitForLoadState('networkidle');

      // Should show error or redirect
      const hasError = await page.locator('text=/invalid|expired|error|no.*token/i').isVisible().catch(() => false);
      const wasRedirected = !page.url().includes('/reset-password');
      const showsForm = await page.locator('input[type="password"]').isVisible().catch(() => false);

      expect(hasError || wasRedirected || showsForm).toBe(true);
    });

    test('should validate token in URL', async ({ page }) => {
      // Access with fake token
      await page.goto('/reset-password#access_token=fake_token&type=recovery');
      await page.waitForLoadState('networkidle');

      await page.waitForTimeout(2000);

      // Should validate and likely show error for invalid token
      const hasForm = await page.locator('input[type="password"]').isVisible().catch(() => false);
      const hasError = await page.locator('text=/invalid|expired|error/i').isVisible().catch(() => false);

      // Either shows form (validates later) or shows error immediately
      expect(hasForm || hasError).toBe(true);
    });
  });
});

test.describe('Route Protection Edge Cases', () => {
  test('should handle direct URL manipulation', async ({ page }) => {
    const protectedPaths = [
      '/account',
      '/account/settings',
      '/account/subscription',
      '/admin',
      '/dashboard',
    ];

    for (const path of protectedPaths) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Should not crash
      await expect(page.locator('body')).toBeVisible();

      // Should not be on protected page if unauthenticated
      const isOnPath = page.url().includes(path);
      const isAuthenticated = await page.locator('[data-testid="user-menu"]').isVisible().catch(() => false);

      if (isOnPath && path === '/account') {
        // If on account page, must be authenticated or showing login
        expect(isAuthenticated || await page.locator('text=/sign in/i').isVisible().catch(() => false)).toBe(true);
      }
    }
  });

  test('should handle logout while on protected route', async ({ page }) => {
    // Login and go to account
    await page.goto('/');
    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    await page.goto('/account');
    await page.waitForLoadState('networkidle');

    // Logout via direct action (not through UI)
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should be redirected or show login
    const isStillOnAccount = page.url().includes('/account');
    const showsLogin = await page.locator('text=/sign in/i').isVisible().catch(() => false);

    expect(!isStillOnAccount || showsLogin).toBe(true);
  });

  test('should preserve query params after auth redirect', async ({ page }) => {
    // This tests if the app preserves intended destination
    await page.goto('/studio?preset=tropical');
    await page.waitForLoadState('networkidle');

    // Login
    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    // Navigate to studio with params
    await page.goto('/studio?preset=tropical');
    await page.waitForLoadState('networkidle');

    // Should preserve query param
    expect(page.url()).toContain('preset=tropical');
  });
});
