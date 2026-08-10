import { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';

export class CartPage extends BasePage {
  protected readonly pageUrl = '/cart.html';

  readonly header: HeaderComponent = new HeaderComponent(this.page);
  private readonly checkoutButton: Locator = this.page.getByTestId('checkout');
  private readonly cartItemNames: Locator = this.page.getByTestId('inventory-item-name');

  protected readonly readyLocator: Locator = this.checkoutButton;

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async verifyProductPresent(name: string): Promise<void> {
    await this.expectVisible(this.cartItemNames.filter({ hasText: name }));
  }
}
