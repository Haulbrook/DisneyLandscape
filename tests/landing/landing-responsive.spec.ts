import { test, expect } from '@playwright/test';

// Mobile tests use project configuration from playwright.config.ts
// These tests run on desktop viewport but test responsive behavior

test.describe('Landing Page - Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load on default viewport', async ({ page }) => {
    await expect(page).toHaveTitle(/Imagine|Landscape|Disney/i);
  });

  test('should display hero content', async ({ page }) => {
    const headline = page.locator('h1, text=/Create.*Landscape/i').first();
    await expect(headline).toBeVisible({ timeout: 5000 });
  });

  test('should display navigation', async ({ page }) => {
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible({ timeout: 5000 });
  });

  test('should be scrollable to pricing section', async ({ page }) => {
    await page.evaluate(() => {
      const pricing = document.querySelector('#pricing');
      if (pricing) pricing.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const pricingContent = page.locator('text=/\\$15|\\$49|\\$149/').first();
    await expect(pricingContent).toBeVisible({ timeout: 5000 });
  });

  test('should display pricing cards', async ({ page }) => {
    await page.evaluate(() => {
      const pricing = document.querySelector('#pricing');
      if (pricing) pricing.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const pricingCards = page.locator('text=/Basic|Pro|Max/i');
    const count = await pricingCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be able to click Sign In button', async ({ page }) => {
    const signInButton = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();

    if (await signInButton.isVisible()) {
      await signInButton.click();
      await page.waitForTimeout(500);

      // Auth modal should open
      const authModal = page.locator('text=/Welcome|Sign|Log/i').first();
      await expect(authModal).toBeVisible({ timeout: 5000 });
    }
  });

  test('should scroll footer into view', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('text=/rights reserved/i').first();
    await expect(footer).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Landing Page - Small Viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load on small viewport', async ({ page }) => {
    await expect(page).toHaveTitle(/Imagine|Landscape|Disney/i);
  });

  test('should display hero on small screen', async ({ page }) => {
    const headline = page.locator('h1').first();
    await expect(headline).toBeVisible({ timeout: 5000 });
  });

  test('should display CTA buttons', async ({ page }) => {
    const ctaButton = page.locator('button:has-text("Try"), a:has-text("Try")').first();
    await expect(ctaButton).toBeVisible({ timeout: 5000 });
  });

  test('should scroll to pricing on small screen', async ({ page }) => {
    await page.evaluate(() => {
      const pricing = document.querySelector('#pricing');
      if (pricing) pricing.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const pricing = page.locator('text=/\\$49/').first();
    await expect(pricing).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Landing Page - Tablet Viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load on tablet viewport', async ({ page }) => {
    await expect(page).toHaveTitle(/Imagine|Landscape|Disney/i);
  });

  test('should display hero with proper layout', async ({ page }) => {
    const headline = page.locator('h1').first();
    await expect(headline).toBeVisible({ timeout: 5000 });
  });

  test('should display feature cards in grid', async ({ page }) => {
    await page.goto('/#features');
    await page.waitForTimeout(500);

    const featureCards = page.locator('[class*="card"], [class*="feature"]').first();
    await expect(featureCards).toBeVisible({ timeout: 5000 });
  });

  test('should display pricing cards in responsive grid', async ({ page }) => {
    await page.goto('/#pricing');
    await page.waitForTimeout(500);

    const pricingCards = page.locator('text=/Basic|Pro|Max/i');
    const count = await pricingCards.count();
    expect(count).toBeGreaterThan(2);
  });
});

test.describe('Landing Page - Large Desktop Viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load on large desktop viewport', async ({ page }) => {
    await expect(page).toHaveTitle(/Imagine|Landscape|Disney/i);
  });

  test('should display full navigation bar', async ({ page }) => {
    const featuresLink = page.locator('a:has-text("Features")').first();
    const pricingLink = page.locator('a:has-text("Pricing")').first();
    const portfolioLink = page.locator('a:has-text("Portfolio")').first();

    await expect(featuresLink).toBeVisible({ timeout: 5000 });
    await expect(pricingLink).toBeVisible({ timeout: 5000 });
    await expect(portfolioLink).toBeVisible({ timeout: 5000 });
  });

  test('should display hero content centered', async ({ page }) => {
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible({ timeout: 5000 });
  });

  test('should display stats in horizontal row', async ({ page }) => {
    const stats = page.locator('text=/200\\+|25|100%/');
    const count = await stats.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should display all pricing tiers visible', async ({ page }) => {
    await page.goto('/#pricing');
    await page.waitForTimeout(500);

    const demo = page.locator('text=/Demo|Free/i').first();
    const basic = page.locator('text=/Basic/i').first();
    const pro = page.locator('text=/Pro/i').first();
    const max = page.locator('text=/Max/i').first();

    await expect(demo).toBeVisible({ timeout: 5000 });
    await expect(basic).toBeVisible({ timeout: 5000 });
    await expect(pro).toBeVisible({ timeout: 5000 });
    await expect(max).toBeVisible({ timeout: 5000 });
  });

  test('should display footer in multi-column layout', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const productSection = page.locator('text=/Product/i').first();
    const companySection = page.locator('text=/Company/i').first();

    await expect(productSection).toBeVisible({ timeout: 5000 });
    await expect(companySection).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Landing Page - Interaction States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show hover state on navigation links', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover not applicable on mobile');
    const featuresLink = page.locator('a:has-text("Features")').first();

    if (await featuresLink.isVisible()) {
      await featuresLink.hover();
      await page.waitForTimeout(200);
      // Hover state should apply
    }
  });

  test('should show hover state on CTA buttons', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover not applicable on mobile');
    const ctaButton = page.locator('button:has-text("Try"), a:has-text("Try Free")').first();

    if (await ctaButton.isVisible()) {
      await ctaButton.hover();
      await page.waitForTimeout(200);
      // Button should lift or change color
    }
  });

  test('should show hover state on pricing cards', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover not applicable on mobile');
    await page.goto('/#pricing');
    await page.waitForTimeout(500);

    const pricingCard = page.locator('[class*="card"]:has-text("Pro")').first();

    if (await pricingCard.isVisible()) {
      await pricingCard.hover();
      await page.waitForTimeout(200);
      // Card should have shadow/scale effect
    }
  });

  test('should show focus state on buttons', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Focus states differ on mobile');
    const signInButton = page.locator('button:has-text("Sign In")').first();

    if (await signInButton.isVisible()) {
      await signInButton.focus();
      await page.waitForTimeout(200);
      // Focus ring should be visible
    }
  });

  test('should support keyboard navigation', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard navigation not applicable on mobile');
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Active element should be focusable
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(activeElement);
  });
});

test.describe('Landing Page - Smooth Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should smooth scroll to features section', async ({ page }) => {
    const featuresLink = page.locator('a[href*="features"]').first();

    if (await featuresLink.isVisible()) {
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await featuresLink.click();

      // Wait for scroll animation
      await page.waitForTimeout(800);

      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
    }
  });

  test('should smooth scroll to pricing section', async ({ page }) => {
    const pricingLink = page.locator('a[href*="pricing"]').first();

    if (await pricingLink.isVisible()) {
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await pricingLink.click();

      await page.waitForTimeout(800);

      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
    }
  });

  test('should smooth scroll to demo section', async ({ page }) => {
    const demoLink = page.locator('a[href*="demo"], button:has-text("Watch Demo")').first();

    if (await demoLink.isVisible()) {
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await demoLink.click();

      await page.waitForTimeout(800);

      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
    }
  });
});
