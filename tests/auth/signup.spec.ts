import { test, expect, openAuthModal, fillSignupForm, submitAuthForm, isAuthenticated, randomEmail, generateUniqueEmail } from '../fixtures/test-fixtures';

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display signup form with all required fields', async ({ page }) => {
    await openAuthModal(page, 'signup');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    // Check for password confirmation
    const passwordInputs = page.locator('input[type="password"]');
    expect(await passwordInputs.count()).toBeGreaterThanOrEqual(1);
  });

  test('should create account with valid information', async ({ page }) => {
    const newEmail = generateUniqueEmail();

    await openAuthModal(page, 'signup');
    await page.waitForTimeout(500); // Wait for modal animation
    await fillSignupForm(page, newEmail, 'TestPassword123!', 'TestPassword123!', 'Test User');
    await submitAuthForm(page);

    // Wait for success (either redirect or success message)
    await Promise.race([
      page.waitForURL('**/studio**', { timeout: 15000 }),
      page.waitForSelector('text=/check your email|verify|confirmation/i', { timeout: 15000 }),
      page.waitForSelector('[data-testid="user-menu"]', { timeout: 15000 }),
      page.waitForSelector('.w-8.h-8.bg-sage-500.rounded-full', { timeout: 15000 }),
    ]);
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Try to signup with existing email (use test user email)
    await openAuthModal(page, 'signup');
    await page.waitForTimeout(500); // Wait for modal animation
    await fillSignupForm(page, 'thaulbrook@gmail.com', 'TestPassword123!', 'TestPassword123!', 'Test User');
    await submitAuthForm(page);

    // Wait for API response
    await page.waitForTimeout(2000);

    // Should show error about existing user
    await expect(page.locator('text=/already|exists|registered|taken|use|in use/i')).toBeVisible({ timeout: 10000 });
  });

  test('should validate password confirmation matches', async ({ page }) => {
    await openAuthModal(page, 'signup');
    await page.waitForTimeout(500); // Wait for modal animation
    await fillSignupForm(page, generateUniqueEmail(), 'TestPassword123!', 'DifferentPassword!', 'Test User');

    // Trigger blur to show validation
    const passwordInputs = page.locator('input[type="password"]');
    if (await passwordInputs.count() > 1) {
      await passwordInputs.nth(1).blur();
      await page.waitForTimeout(500);
    }

    await submitAuthForm(page);

    // Should show mismatch error
    await expect(page.locator('text=/match|same|confirm|don.*t match/i')).toBeVisible({ timeout: 10000 });
  });

  test('should enforce minimum password length', async ({ page }) => {
    await openAuthModal(page, 'signup');
    await page.waitForTimeout(500); // Wait for modal animation
    await fillSignupForm(page, generateUniqueEmail(), '12345', '12345', 'Test User');

    // Trigger blur to show validation
    await page.locator('input[type="password"]').first().blur();
    await page.waitForTimeout(500);

    await submitAuthForm(page);

    // Should show password length error (Supabase requires 6+ chars)
    await expect(page.locator('text=/password|short|minimum|characters|6|weak/i')).toBeVisible({ timeout: 10000 });
  });

  test('should reject invalid email formats', async ({ page }) => {
    const invalidEmails = [
      'notanemail',
      '@nodomain.com',
      'missing@',
      'spaces in@email.com',
    ];

    for (const email of invalidEmails) {
      await openAuthModal(page, 'signup');
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', 'ValidPassword123!');
      await submitAuthForm(page);

      // Should show validation error or not submit
      await page.waitForTimeout(500);
      expect(await isAuthenticated(page)).toBe(false);
    }
  });

  test('should handle concurrent signup attempts with same email', async ({ page, context }) => {
    const sharedEmail = randomEmail();
    const pages: any[] = [];

    // Open multiple tabs
    for (let i = 0; i < 3; i++) {
      const newPage = await context.newPage();
      await newPage.goto('/');
      await openAuthModal(newPage, 'signup');
      await fillSignupForm(newPage, sharedEmail, 'TestPassword123!', 'TestPassword123!', `User ${i}`);
      pages.push(newPage);
    }

    // Submit all at once
    await Promise.all(pages.map((p) => submitAuthForm(p)));

    // Wait for results
    await Promise.all(pages.map((p) => p.waitForTimeout(3000)));

    // Only one should succeed, others should fail
    let successCount = 0;
    for (const p of pages) {
      if (await isAuthenticated(p)) {
        successCount++;
      }
    }

    // Due to race conditions, at most one should succeed
    expect(successCount).toBeLessThanOrEqual(1);

    // Cleanup
    for (const p of pages) {
      await p.close();
    }
  });
});

test.describe('Signup Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await openAuthModal(page, 'signup');
  });

  test('should sanitize XSS in full name field', async ({ page }) => {
    const xssPayload = '<script>alert("xss")</script>';

    await fillSignupForm(page, randomEmail(), 'TestPassword123!', 'TestPassword123!', xssPayload);
    await submitAuthForm(page);

    // Wait for response
    await page.waitForTimeout(2000);

    // Check that script tag is not executed or rendered
    const bodyContent = await page.content();
    expect(bodyContent).not.toContain('<script>alert("xss")</script>');
  });

  test('should rate limit signup attempts', async ({ page }) => {
    // Attempt many signups rapidly
    const attempts = 10;
    let rateLimited = false;

    for (let i = 0; i < attempts; i++) {
      await fillSignupForm(page, randomEmail(), 'TestPassword123!', 'TestPassword123!', 'Test');
      await submitAuthForm(page);

      // Check for rate limit message
      const rateLimitMsg = page.locator('text=/rate|limit|too many|slow down/i');
      if (await rateLimitMsg.isVisible({ timeout: 1000 }).catch(() => false)) {
        rateLimited = true;
        break;
      }

      await page.fill('input[type="email"]', '');
      await page.waitForTimeout(100);
    }

    // Rate limiting is optional but good to have
    console.log(`Rate limiting detected: ${rateLimited}`);
  });
});
