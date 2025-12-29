import { test, expect, TEST_USERS, openAuthModal, fillLoginForm, submitAuthForm, waitForLogin, isAuthenticated, logout } from '../fixtures/test-fixtures';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form in auth modal', async ({ page }) => {
    await openAuthModal(page, 'signin');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Sign In")')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);

    await waitForLogin(page);
    expect(await isAuthenticated(page)).toBe(true);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.invalid.email, TEST_USERS.invalid.password);
    await submitAuthForm(page);

    // Wait for error message
    await expect(page.locator('text=/invalid|error|incorrect|wrong/i')).toBeVisible({ timeout: 10000 });
    expect(await isAuthenticated(page)).toBe(false);
  });

  test('should show error with empty email', async ({ page }) => {
    await openAuthModal(page, 'signin');
    await page.fill('input[type="password"]', TEST_USERS.valid.password);
    await submitAuthForm(page);

    // Should show validation error or not submit
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show error with empty password', async ({ page }) => {
    await openAuthModal(page, 'signin');
    await page.fill('input[type="email"]', TEST_USERS.valid.email);
    await submitAuthForm(page);

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should toggle password visibility', async ({ page }) => {
    await openAuthModal(page, 'signin');

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('testpassword');

    // Look for visibility toggle button
    const toggleButton = page.locator('button:near(input[type="password"])').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(page.locator('input[type="text"][value="testpassword"]')).toBeVisible();
    }
  });

  test('should persist session after page refresh', async ({ page }) => {
    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    expect(await isAuthenticated(page)).toBe(true);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await openAuthModal(page, 'signin');
    await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
    await submitAuthForm(page);
    await waitForLogin(page);

    // Logout
    await logout(page);

    // Verify logged out
    expect(await isAuthenticated(page)).toBe(false);
    await expect(page.locator('button:has-text("Sign In"), button:has-text("Get Started")')).toBeVisible();
  });

  test('should handle rapid login/logout cycles', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      // Login
      await openAuthModal(page, 'signin');
      await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
      await submitAuthForm(page);
      await waitForLogin(page);

      // Small delay
      await page.waitForTimeout(500);

      // Logout
      await logout(page);
      await page.waitForTimeout(500);
    }

    // Should be logged out
    expect(await isAuthenticated(page)).toBe(false);
  });
});

test.describe('Login Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await openAuthModal(page, 'signin');
  });

  test('should reject invalid email format', async ({ page }) => {
    await fillLoginForm(page, 'invalidemail', TEST_USERS.valid.password);
    await submitAuthForm(page);

    // Check for validation error
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should handle SQL injection attempts gracefully', async ({ page }) => {
    const maliciousInputs = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "<script>alert('xss')</script>",
      "admin'--",
    ];

    for (const input of maliciousInputs) {
      await page.fill('input[type="email"]', input + '@test.com');
      await page.fill('input[type="password"]', input);
      await submitAuthForm(page);

      // Should show error, not crash or allow access
      await page.waitForTimeout(1000);
      expect(await isAuthenticated(page)).toBe(false);

      // Clear form for next iteration
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="password"]', '');
    }
  });

  test('should handle extremely long input', async ({ page }) => {
    const longString = 'a'.repeat(10000);

    await page.fill('input[type="email"]', longString + '@test.com');
    await page.fill('input[type="password"]', longString);
    await submitAuthForm(page);

    // Should handle gracefully
    await page.waitForTimeout(2000);
    expect(await isAuthenticated(page)).toBe(false);
  });
});
