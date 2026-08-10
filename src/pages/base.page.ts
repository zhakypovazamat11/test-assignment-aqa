import { Locator, Page, expect } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly pageUrl: string;
  protected abstract readonly readyLocator: Locator;

  constructor(protected readonly page: Page) {}

  async openPage(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.verifyPageIsOpened();
  }

  async verifyPageIsOpened(): Promise<void> {
    const escapedUrl = this.pageUrl.replace(/\./g, '\\.');
    await expect(this.page).toHaveURL(new RegExp(`${escapedUrl}$`));
    await expect(this.readyLocator).toBeVisible();
  }

  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  protected async expectText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }
}
