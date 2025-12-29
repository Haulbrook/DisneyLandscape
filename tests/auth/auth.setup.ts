import { test as setup, expect } from '@playwright/test';
import { TEST_USERS, fillLoginForm, submitAuthForm, openAuthModal, waitForLogin } from '../fixtures/test-fixtures';

const authFile = './tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to home page
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Open auth modal and login
  await openAuthModal(page, 'signin');
  await fillLoginForm(page, TEST_USERS.valid.email, TEST_USERS.valid.password);
  await submitAuthForm(page);

  // Wait for successful authentication (modal closes, user menu appears)
  await waitForLogin(page, 15000);

  // Verify authenticated state - look for the user avatar
  await expect(page.locator('.w-8.h-8.bg-sage-500.rounded-full')).toBeVisible({ timeout: 10000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
