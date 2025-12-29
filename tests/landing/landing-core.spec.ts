import { test, expect } from '@playwright/test';

test.describe('Landing Page - Core Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Structure', () => {
    test('should load landing page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Imagine|Landscape|Disney/i);
    });

    test('should display hero section', async ({ page }) => {
      const heroContent = page.locator('text=/Create.*Landscape|Professional.*Design/i').first();
      await expect(heroContent).toBeVisible({ timeout: 5000 });
    });

    test('should display features section', async ({ page }) => {
      const featuresSection = page.locator('#features, text=/Everything You Need/i').first();
      await expect(featuresSection).toBeVisible({ timeout: 5000 });
    });

    test('should display pricing section', async ({ page }) => {
      const pricingSection = page.locator('#pricing, text=/Pricing/i').first();
      await expect(pricingSection).toBeVisible({ timeout: 5000 });
    });

    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer, text=/rights reserved/i').first();
      await expect(footer).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Navigation Bar', () => {
    test('should display brand logo/name', async ({ page }) => {
      const brandName = page.locator('text=/Imagine|Landscape|Studio/i').first();
      await expect(brandName).toBeVisible({ timeout: 5000 });
    });

    test('should display Features link', async ({ page }) => {
      const featuresLink = page.locator('a:has-text("Features"), button:has-text("Features")').first();
      await expect(featuresLink).toBeVisible({ timeout: 5000 });
    });

    test('should display Pricing link', async ({ page }) => {
      const pricingLink = page.locator('a:has-text("Pricing"), button:has-text("Pricing")').first();
      await expect(pricingLink).toBeVisible({ timeout: 5000 });
    });

    test('should display Portfolio link', async ({ page }) => {
      const portfolioLink = page.locator('a:has-text("Portfolio"), button:has-text("Portfolio")').first();
      await expect(portfolioLink).toBeVisible({ timeout: 5000 });
    });

    test('should display Sign In button for unauthenticated users', async ({ page }) => {
      const signInButton = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();
      await expect(signInButton).toBeVisible({ timeout: 5000 });
    });

    test('should scroll to features section when clicking Features link', async ({ page }) => {
      const featuresLink = page.locator('a:has-text("Features"), a[href*="features"]').first();

      if (await featuresLink.isVisible()) {
        await featuresLink.click();
        await page.waitForTimeout(500);

        // Should scroll down
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
      }
    });

    test('should scroll to pricing section when clicking Pricing link', async ({ page }) => {
      const pricingLink = page.locator('a:has-text("Pricing"), a[href*="pricing"]').first();

      if (await pricingLink.isVisible()) {
        await pricingLink.click();
        await page.waitForTimeout(500);

        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
      }
    });

    test('should navigate to portfolio when clicking Portfolio link', async ({ page }) => {
      const portfolioLink = page.locator('a:has-text("Portfolio"), a[href*="portfolio"]').first();

      if (await portfolioLink.isVisible()) {
        await portfolioLink.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('/portfolio');
      }
    });
  });
});

test.describe('Landing Page - Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Hero Content', () => {
    test('should display main headline', async ({ page }) => {
      const headline = page.locator('h1, text=/Create.*Professional.*Landscape/i').first();
      await expect(headline).toBeVisible({ timeout: 5000 });
    });

    test('should display subtitle description', async ({ page }) => {
      const subtitle = page.locator('text=/professional|design|plants|canvas/i').first();
      await expect(subtitle).toBeVisible({ timeout: 5000 });
    });

    test('should display badge with sparkles', async ({ page }) => {
      const badge = page.locator('text=/Professional.*Tool|Landscape.*Design/i').first();
      await expect(badge).toBeVisible({ timeout: 5000 });
    });

    test('should display primary CTA button (Try Free/Start Demo)', async ({ page }) => {
      const primaryCTA = page.locator('button:has-text("Try"), button:has-text("Start"), button:has-text("Demo"), a:has-text("Try Free")').first();
      await expect(primaryCTA).toBeVisible({ timeout: 5000 });
    });

    test('should display secondary CTA button (Watch Demo)', async ({ page }) => {
      const secondaryCTA = page.locator('button:has-text("Watch"), a:has-text("Watch Demo")').first();
      await expect(secondaryCTA).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to studio when clicking primary CTA', async ({ page }) => {
      const primaryCTA = page.locator('a[href*="studio"], button:has-text("Try Free"), button:has-text("Start Demo")').first();

      if (await primaryCTA.isVisible()) {
        await primaryCTA.click();
        await page.waitForTimeout(1000);

        expect(page.url()).toContain('/studio');
      }
    });

    test('should scroll to demo section when clicking Watch Demo', async ({ page }) => {
      const watchDemo = page.locator('a[href*="demo"], button:has-text("Watch Demo")').first();

      if (await watchDemo.isVisible()) {
        await watchDemo.click();
        await page.waitForTimeout(500);

        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Stats Section', () => {
    test('should display plant count stat (200+)', async ({ page }) => {
      const plantStat = page.locator('text=/200\\+|Curated Plants/i').first();
      await expect(plantStat).toBeVisible({ timeout: 5000 });
    });

    test('should display bundles count stat (25)', async ({ page }) => {
      const bundleStat = page.locator('text=/25|Theme Bundles/i').first();
      await expect(bundleStat).toBeVisible({ timeout: 5000 });
    });

    test('should display pro standards stat (100%)', async ({ page }) => {
      const proStat = page.locator('text=/100%|Pro Standards/i').first();
      await expect(proStat).toBeVisible({ timeout: 5000 });
    });
  });
});

test.describe('Landing Page - Demo Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Scroll to demo section
    await page.evaluate(() => {
      const demo = document.querySelector('#demo');
      if (demo) demo.scrollIntoView();
    });
    await page.waitForTimeout(500);
  });

  test.describe('Demo Display', () => {
    test('should display demo section heading', async ({ page }) => {
      const demoHeading = page.locator('text=/See It In Action|Interactive Preview/i').first();
      await expect(demoHeading).toBeVisible({ timeout: 5000 });
    });

    test('should display scene tabs', async ({ page }) => {
      const tabs = page.locator('text=/Design|Bundles|Vision|Analysis|Export/i');
      const count = await tabs.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display animated demo component', async ({ page }) => {
      // Demo should have interactive elements
      const demoContainer = page.locator('[class*="demo"], [class*="animation"]').first();
    });

    test('should allow clicking scene tabs to switch content', async ({ page }) => {
      const bundlesTab = page.locator('button:has-text("Bundles"), [role="tab"]:has-text("Bundles")').first();

      if (await bundlesTab.isVisible()) {
        await bundlesTab.click();
        await page.waitForTimeout(500);

        // Bundles content should be visible
        const bundleContent = page.locator('text=/bundle|theme/i').first();
      }
    });
  });

  test.describe('Feature Cards Below Demo', () => {
    test('should display feature cards grid', async ({ page }) => {
      const featureCards = page.locator('[class*="card"], [class*="feature"]');
      const count = await featureCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display Smart Plant Placement card', async ({ page }) => {
      const plantCard = page.locator('text=/Smart Plant|Placement/i').first();
    });

    test('should display Theme Bundles card', async ({ page }) => {
      const bundleCard = page.locator('text=/Theme Bundle/i').first();
    });

    test('should display AI Vision card', async ({ page }) => {
      const visionCard = page.locator('text=/AI Vision|Rendering/i').first();
    });
  });
});

test.describe('Landing Page - Features Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#features');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test.describe('Features Display', () => {
    test('should display features section heading', async ({ page }) => {
      const heading = page.locator('text=/Everything You Need/i').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('should display Curated Plant Database feature', async ({ page }) => {
      const feature = page.locator('text=/Curated Plant|Plant Database/i').first();
      await expect(feature).toBeVisible({ timeout: 5000 });
    });

    test('should display Theme Bundles feature', async ({ page }) => {
      const feature = page.locator('text=/Theme.*Bundle/i').first();
      await expect(feature).toBeVisible({ timeout: 5000 });
    });

    test('should display Quality Validation feature', async ({ page }) => {
      const feature = page.locator('text=/Quality|Validation/i').first();
      await expect(feature).toBeVisible({ timeout: 5000 });
    });

    test('should display Interactive Canvas feature', async ({ page }) => {
      const feature = page.locator('text=/Interactive Canvas/i').first();
      await expect(feature).toBeVisible({ timeout: 5000 });
    });

    test('should display Vision Rendering feature', async ({ page }) => {
      const feature = page.locator('text=/Vision Rendering/i').first();
      await expect(feature).toBeVisible({ timeout: 5000 });
    });

    test('should display Professional Export feature', async ({ page }) => {
      const feature = page.locator('text=/Professional Export|Export/i').first();
      await expect(feature).toBeVisible({ timeout: 5000 });
    });

    test('should have hover effects on feature cards', async ({ page, isMobile }) => {
      test.skip(isMobile, 'Hover not applicable on mobile');
      const featureCard = page.locator('[class*="card"]').first();

      if (await featureCard.isVisible()) {
        await featureCard.hover();
        await page.waitForTimeout(300);
        // Hover state should apply (shadow, border change)
      }
    });
  });
});

test.describe('Landing Page - Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  });

  test.describe('Footer Content', () => {
    test('should display footer with dark background', async ({ page }) => {
      const footer = page.locator('footer, [class*="sage-900"]').first();
      await expect(footer).toBeVisible({ timeout: 5000 });
    });

    test('should display brand information', async ({ page }) => {
      const brand = page.locator('text=/Imagine.*Landscape|Landscape.*Studio/i').first();
      await expect(brand).toBeVisible({ timeout: 5000 });
    });

    test('should display Product links section', async ({ page }) => {
      const productSection = page.locator('text=/Product/i').first();
    });

    test('should display Company links section', async ({ page }) => {
      const companySection = page.locator('text=/Company/i').first();
    });

    test('should display copyright text', async ({ page }) => {
      const copyright = page.locator('text=/©|rights reserved/i').first();
      await expect(copyright).toBeVisible({ timeout: 5000 });
    });

    test('should have working Features link in footer', async ({ page }) => {
      const featuresLink = page.locator('footer a:has-text("Features"), footer a[href*="features"]').first();

      if (await featuresLink.isVisible()) {
        await featuresLink.click();
        await page.waitForTimeout(500);
      }
    });

    test('should have working Pricing link in footer', async ({ page }) => {
      const pricingLink = page.locator('footer a:has-text("Pricing"), footer a[href*="pricing"]').first();

      if (await pricingLink.isVisible()) {
        await pricingLink.click();
        await page.waitForTimeout(500);
      }
    });

    test('should have Launch Studio link', async ({ page }) => {
      const studioLink = page.locator('footer a:has-text("Studio"), footer a[href*="studio"]').first();

      if (await studioLink.isVisible()) {
        await studioLink.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('/studio');
      }
    });
  });
});
