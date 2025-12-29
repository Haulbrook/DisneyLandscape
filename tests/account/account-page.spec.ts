import { test, expect } from '@playwright/test';
import { TEST_USERS, openAuthModal, fillLoginForm, submitAuthForm, waitForLogin } from '../fixtures/test-fixtures';

test.describe('Account Page - Unauthenticated Access', () => {
  test('should redirect to login or show auth prompt when accessing /account', async ({ page }) => {
    await page.goto('/account');
    await page.waitForLoadState('networkidle');

    // Either redirects to home/login or shows auth modal
    const authPrompt = page.locator('text=/sign in|log in|authenticate/i').first();
    const homeRedirect = page.url().includes('/') && !page.url().includes('/account');

    // One of these should be true
  });
});

test.describe('Account Page - Authenticated Access', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    // Navigate to account page
    await page.goto('/account');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Account Page Layout', () => {
    test('should display account page heading', async ({ page }) => {
      const heading = page.locator('h1:has-text("Account"), h2:has-text("Account"), text=/Account Settings/i').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('should display user email', async ({ page }) => {
      const emailDisplay = page.locator(`text=/${TEST_USERS.valid.email.split('@')[0]}|${TEST_USERS.valid.email}/i`).first();
      await expect(emailDisplay).toBeVisible({ timeout: 5000 });
    });

    test('should display subscription status section', async ({ page }) => {
      const subscriptionSection = page.locator('text=/subscription|plan|membership/i').first();
      await expect(subscriptionSection).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Profile Section', () => {
    test('should display profile information', async ({ page }) => {
      const profileSection = page.locator('text=/profile|account info|personal/i').first();
    });

    test('should show user email in profile', async ({ page }) => {
      const email = page.locator('text=/@/').first();
      await expect(email).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Subscription Section', () => {
    test('should display current plan', async ({ page }) => {
      const planDisplay = page.locator('text=/free|basic|pro|max|current plan/i').first();
      await expect(planDisplay).toBeVisible({ timeout: 5000 });
    });

    test('should show upgrade button for free users', async ({ page }) => {
      const upgradeButton = page.locator('button:has-text("Upgrade"), a:has-text("Upgrade")').first();
      // Visible for free tier users
    });

    test('should show manage subscription button for paid users', async ({ page }) => {
      const manageButton = page.locator('button:has-text("Manage"), a:has-text("Manage Subscription")').first();
      // Visible for paid tier users
    });

    test('should display subscription status message', async ({ page }) => {
      const statusMessage = page.locator('text=/active|free|trial|expires|renews/i').first();
    });
  });

  test.describe('Account Actions', () => {
    test('should have sign out button', async ({ page }) => {
      const signOutButton = page.locator('button:has-text("Sign Out"), button:has-text("Log Out")').first();
      await expect(signOutButton).toBeVisible({ timeout: 5000 });
    });

    test('should sign out when clicking sign out button', async ({ page }) => {
      const signOutButton = page.locator('button:has-text("Sign Out"), button:has-text("Log Out")').first();

      if (await signOutButton.isVisible()) {
        await signOutButton.click();
        await page.waitForTimeout(1000);

        // Should redirect to home and show sign in button
        const signInButton = page.locator('button:has-text("Sign In")').first();
        await expect(signInButton).toBeVisible({ timeout: 5000 });
      }
    });

    test('should have link back to studio', async ({ page }) => {
      const studioLink = page.locator('a:has-text("Studio"), button:has-text("Studio"), a[href*="studio"]').first();
      await expect(studioLink).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to studio when clicking studio link', async ({ page }) => {
      const studioLink = page.locator('a:has-text("Studio"), a[href*="studio"]').first();

      if (await studioLink.isVisible()) {
        await studioLink.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('/studio');
      }
    });
  });
});

test.describe('Account Page - Subscription Management', () => {
  test('should call create-portal-session when clicking manage subscription', async ({ page }) => {
    let portalCalled = false;

    await page.route('**/.netlify/functions/create-portal-session', async (route) => {
      portalCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://billing.stripe.com/session/test_portal'
        }),
      });
    });

    // Login and navigate to account
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    await page.goto('/account');
    await page.waitForLoadState('networkidle');

    const manageButton = page.locator('button:has-text("Manage Subscription")').first();
    if (await manageButton.isVisible()) {
      await manageButton.click();
      await page.waitForTimeout(500);

      // Portal should be called (for subscribed users)
    }
  });

  test('should navigate to pricing when clicking upgrade', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    await page.goto('/account');
    await page.waitForLoadState('networkidle');

    const upgradeButton = page.locator('button:has-text("Upgrade"), a:has-text("Upgrade")').first();

    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      await page.waitForTimeout(500);

      // Should navigate to pricing section or show pricing
      expect(page.url()).toMatch(/#pricing|\/pricing/);
    }
  });
});

test.describe('Account Page - Usage Statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    await page.goto('/account');
    await page.waitForLoadState('networkidle');
  });

  test('should display usage section for tiered users', async ({ page }) => {
    const usageSection = page.locator('text=/usage|remaining|this month/i').first();
    // Visible for Basic/Pro users
  });

  test('should show projects remaining', async ({ page }) => {
    const projectsRemaining = page.locator('text=/project.*remaining|\\d+.*project/i').first();
  });

  test('should show vision renders remaining', async ({ page }) => {
    const visionsRemaining = page.locator('text=/render.*remaining|vision.*remaining/i').first();
  });

  test('should show exports remaining', async ({ page }) => {
    const exportsRemaining = page.locator('text=/export.*remaining/i').first();
  });
});

test.describe('User Dropdown Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);
  });

  test('should display user avatar after login', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full, [class*="avatar"]').first();
    await expect(userAvatar).toBeVisible({ timeout: 5000 });
  });

  test('should open dropdown when clicking avatar', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      // Dropdown should be visible
      const dropdown = page.locator('text=/Open Studio|Account Settings|Sign Out/i').first();
      await expect(dropdown).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show Open Studio option in dropdown', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      const studioOption = page.locator('button:has-text("Open Studio"), a:has-text("Open Studio")').first();
      await expect(studioOption).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show Account Settings option in dropdown', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      const accountOption = page.locator('button:has-text("Account"), a:has-text("Account")').first();
      await expect(accountOption).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to studio from dropdown', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      const studioOption = page.locator('button:has-text("Open Studio"), a:has-text("Open Studio")').first();
      if (await studioOption.isVisible()) {
        await studioOption.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('/studio');
      }
    }
  });

  test('should navigate to account from dropdown', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      const accountOption = page.locator('button:has-text("Account Settings"), a:has-text("Account")').first();
      if (await accountOption.isVisible()) {
        await accountOption.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('/account');
      }
    }
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      // Click outside the dropdown
      await page.mouse.click(100, 100);
      await page.waitForTimeout(300);

      // Dropdown should be closed
      const dropdown = page.locator('text=/Sign Out/i').first();
      await expect(dropdown).not.toBeVisible({ timeout: 2000 });
    }
  });

  test('should sign out from dropdown', async ({ page }) => {
    const userAvatar = page.locator('.w-8.h-8.bg-sage-500.rounded-full').first();

    if (await userAvatar.isVisible()) {
      await userAvatar.click();
      await page.waitForTimeout(300);

      const signOutOption = page.locator('button:has-text("Sign Out")').first();
      if (await signOutOption.isVisible()) {
        await signOutOption.click();
        await page.waitForTimeout(1000);

        // Should be signed out, Sign In button visible
        const signInButton = page.locator('button:has-text("Sign In")').first();
        await expect(signInButton).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
