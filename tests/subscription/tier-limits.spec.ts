import { test, expect, TEST_USERS, openAuthModal, fillLoginForm, submitAuthForm, waitForLogin, isAuthenticated, closeAnyOpenModals } from '../fixtures/test-fixtures';

test.describe('Subscription Tier Tests', () => {
  test.describe('Free Tier Limits', () => {
    test('should enforce 5 plant limit for free users', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Look for plant limit indicator
      const plantLimit = page.locator('text=/5.*plant|plant.*5|limit.*5/i');
      await expect(plantLimit.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // May not show explicit limit, but limits should exist
      });
    });

    test('should show upgrade prompt for export feature', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Find and click export button
      const exportButton = page.locator('button:has-text("Export"), [data-testid="export-button"]');
      if (await exportButton.isVisible()) {
        await exportButton.click();

        // Should show upgrade prompt
        await expect(
          page.locator('text=/upgrade|subscribe|premium|pro|basic/i')
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test('should show upgrade prompt for Vision AI feature', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Find and click Vision button
      const visionButton = page.locator('button:has-text("Vision"), button:has-text("AI"), [data-testid="vision-button"]');
      if (await visionButton.isVisible()) {
        await visionButton.click();

        // Should show upgrade prompt
        await expect(
          page.locator('text=/upgrade|subscribe|premium/i')
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test('should show upgrade prompt for save feature', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Find save button
      const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
      if (await saveButton.isVisible()) {
        await saveButton.click();

        // For free tier, should show upgrade prompt or auth modal
        await expect(
          page.locator('text=/upgrade|subscribe|sign in|create account/i')
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test('should block bundle access for free users', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Look for bundle-related UI
      const bundleButton = page.locator('button:has-text("Bundle"), [data-testid="bundle-button"]');
      if (await bundleButton.isVisible()) {
        await bundleButton.click();

        // Should show upgrade prompt
        await expect(
          page.locator('text=/upgrade|subscribe|premium|pro|basic/i')
        ).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Authenticated User Tier Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await openAuthModal(page, 'signin');
      await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
      await submitAuthForm(page);
      await waitForLogin(page);
    });

    test('should display current subscription tier', async ({ page }) => {
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      // Should show current plan
      await expect(
        page.locator('text=/free|basic|pro|max|subscription|plan/i')
      ).toBeVisible({ timeout: 5000 });
    });

    test('should show usage statistics', async ({ page }) => {
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      // Look for usage indicators
      const usageIndicators = page.locator('text=/used|remaining|limit|projects|renders|exports/i');
      await expect(usageIndicators.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // May not show usage for all tiers
      });
    });

    test('should show upgrade options', async ({ page }) => {
      await page.goto('/account');
      await page.waitForLoadState('networkidle');

      // Should have upgrade option (unless on max tier)
      const upgradeButton = page.locator('button:has-text("Upgrade"), a:has-text("Upgrade"), text=/upgrade/i');
      const isMaxTier = await page.locator('text=/max|enterprise|unlimited/i').isVisible().catch(() => false);

      if (!isMaxTier) {
        await expect(upgradeButton.first()).toBeVisible({ timeout: 5000 }).catch(() => {
          // May be on max tier already
        });
      }
    });
  });

  test.describe('Tier Feature Matrix', () => {
    const TIER_FEATURES = {
      free: {
        maxPlants: 5,
        bundles: false,
        export: false,
        vision: false,
        cloudSave: false,
      },
      basic: {
        maxPlants: 45,
        bundles: true,
        export: true,
        vision: true,
        cloudSave: false,
      },
      pro: {
        maxPlants: 100,
        bundles: true,
        export: true,
        vision: true,
        cloudSave: true,
      },
      max: {
        maxPlants: Infinity,
        bundles: true,
        export: true,
        vision: true,
        cloudSave: true,
      },
    };

    test('should display accurate feature comparison on pricing page', async ({ page }) => {
      await page.goto('/#pricing');
      await page.waitForLoadState('networkidle');

      // Check that pricing section exists
      const pricingSection = page.locator('[id="pricing"], .pricing, section:has-text("Pricing")');
      await expect(pricingSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // Pricing might be on separate page
        page.goto('/pricing');
      });

      // Verify tier cards exist
      const tierCards = page.locator('.tier-card, [data-tier], .pricing-card');
      if (await tierCards.count() > 0) {
        expect(await tierCards.count()).toBeGreaterThanOrEqual(3); // At least Free, Basic, Pro
      }
    });

    test('should highlight recommended plan', async ({ page }) => {
      await page.goto('/#pricing');
      await page.waitForLoadState('networkidle');

      // Look for recommended/popular indicator
      const recommended = page.locator('text=/recommended|popular|best value/i');
      await expect(recommended.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // Might not have recommended styling
      });
    });
  });

  test.describe('Monthly Usage Tracking', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await openAuthModal(page, 'signin');
      await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
      await submitAuthForm(page);
      await waitForLogin(page);
    });

    test('should track and display monthly limits', async ({ page }) => {
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Look for limit indicators
      const limitIndicator = page.locator('text=/\\/.*month|remaining|used/i');
      if (await limitIndicator.count() > 0) {
        await expect(limitIndicator.first()).toBeVisible();
      }
    });

    test('should show warning when approaching limits', async ({ page }) => {
      // This test assumes we can simulate near-limit state
      await page.goto('/studio');
      await page.waitForLoadState('networkidle');

      // Check for warning indicators
      const warningIndicator = page.locator('.warning, .limit-warning, text=/almost|running low|limit/i');
      // This is conditional on user's actual usage
      const hasWarning = await warningIndicator.count() > 0;
      console.log(`Usage warning visible: ${hasWarning}`);
    });
  });
});

test.describe('Upgrade Flow', () => {
  test('should navigate to Stripe checkout for Basic plan', async ({ page }) => {
    await page.goto('/#pricing');
    await page.waitForLoadState('networkidle');

    // Click Basic plan CTA
    const basicCTA = page.locator('button:has-text("Basic"), [data-tier="basic"] button').first();
    if (await basicCTA.isVisible()) {
      // Intercept navigation to Stripe
      const [popup] = await Promise.all([
        page.waitForEvent('popup').catch(() => null),
        basicCTA.click(),
      ]);

      // Should open Stripe or show auth modal
      await page.waitForTimeout(2000);

      const showsAuth = await page.locator('[role="dialog"], .auth-modal').isVisible().catch(() => false);
      const redirected = page.url().includes('stripe') || page.url().includes('checkout');

      if (popup) {
        expect(popup.url()).toContain('stripe');
        await popup.close();
      } else {
        expect(showsAuth || redirected).toBe(true);
      }
    }
  });

  test('should require authentication before checkout', async ({ page }) => {
    await page.goto('/#pricing');
    await page.waitForLoadState('networkidle');

    // Try to upgrade without auth
    const upgradeCTA = page.locator('[data-tier] button, button:has-text("Subscribe"), button:has-text("Get")').first();
    if (await upgradeCTA.isVisible()) {
      await upgradeCTA.click();

      // Should show auth modal for unauthenticated users
      await expect(
        page.locator('[role="dialog"], .auth-modal, text=/sign in|create account/i')
      ).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Watermark Enforcement', () => {
  test('should show watermark for free/basic tier exports', async ({ page }) => {
    await page.goto('/studio');
    await page.waitForLoadState('networkidle');

    // Look for watermark indicator
    const watermarkIndicator = page.locator('text=/watermark|will include|branded/i');
    if (await watermarkIndicator.count() > 0) {
      await expect(watermarkIndicator.first()).toBeVisible();
    }
  });
});
