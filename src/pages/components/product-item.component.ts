import { Locator, Page } from '@playwright/test';

/**
 * Карточка товара на inventory-странице, повторяется многократно на одной странице.
 */
export class ProductItemComponent {
  readonly price: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;

  constructor(page: Page, name: string) {
    const root = page.locator('.inventory_item', { hasText: name });
    this.price = root.getByTestId('inventory-item-price');
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
    this.removeButton = root.getByRole('button', { name: 'Remove' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async getPrice(): Promise<string> {
    return this.price.innerText();
  }
}
