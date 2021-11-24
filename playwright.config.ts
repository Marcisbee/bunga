import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Look for test files in the "e2e" directory, relative to this configuration file
  testDir: 'e2e',

  // Each test is given 30 seconds
  timeout: 30000,

  // Forbid test.only on CI
  forbidOnly: !!process.env.CI,

  retries: 0,

  workers: process.env.CI ? 1 : 4,

  // Concise 'dot' for CI, default 'list' when running locally
  reporter: process.env.CI ? 'dot' : 'list',

  use: {
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'npm run preview',
    port: 5000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
