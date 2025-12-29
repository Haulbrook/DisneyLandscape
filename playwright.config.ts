import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Increase timeouts for slower operations
  timeout: 60000, // 60s per test
  expect: {
    timeout: 10000, // 10s for assertions
  },

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15000, // 15s for actions
    navigationTimeout: 30000, // 30s for navigation
  },

  projects: [
    // Auth state setup
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },

    // Stress test project (chromium only, high parallelism)
    {
      name: 'stress',
      testMatch: /.*stress.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: true,
      workers: 10,
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
