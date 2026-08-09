import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Позволяет переключать окружения через ENV_FILE, например:
 * ENV_FILE=.env.staging npx playwright test
 */
dotenv.config({ path: path.resolve(__dirname, process.env.ENV_FILE ?? '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    /* retain-on-failure: не плодим трейсы на зелёных прогонах, но при падении
       есть полный трейс для разбора */
    trace: 'retain-on-failure',
    /* На сайте атрибут для тестовых хуков — data-test, а не стандартный
       data-testid, поэтому getByTestId() ищет именно по нему. */
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Кросс-браузерность вне обязательного скоупа задания — включить при необходимости.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
