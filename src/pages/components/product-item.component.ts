import { Locator, Page } from '@playwright/test';

export class ProductItemComponent {
  private readonly addToCartButton: Locator;

  constructor(page: Page, name: string) {
    const root = page.locator('.inventory_item', { hasText: name });
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
