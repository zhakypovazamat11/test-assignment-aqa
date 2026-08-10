import { Locator, Page, expect } from '@playwright/test';

export class HeaderComponent {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async verifyCartBadgeCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async verifyCartBadgeHidden(): Promise<void> {
    await expect(this.cartBadge).toBeHidden();
  }
}
