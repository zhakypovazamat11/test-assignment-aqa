import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutStepTwoPage extends BasePage {
  protected readonly pageUrl = '/checkout-step-two.html';

  private readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
  private readonly subtotalLabel: Locator = this.page.getByTestId('subtotal-label');
  private readonly taxLabel: Locator = this.page.getByTestId('tax-label');
  private readonly totalLabel: Locator = this.page.getByTestId('total-label');
  private readonly finishButton: Locator = this.page.getByTestId('finish');

  protected readonly readyLocator: Locator = this.finishButton;

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async verifyProductPresent(name: string): Promise<void> {
    await this.expectVisible(this.itemNames.filter({ hasText: name }));
  }

  async verifyOrderTotalsAreConsistent(): Promise<void> {
    const subtotal = await this.readAmount(this.subtotalLabel);
    const tax = await this.readAmount(this.taxLabel);
    const total = await this.readAmount(this.totalLabel);

    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  private async readAmount(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    const [amount] = text.match(/[\d.]+/) ?? [];
    return Number(amount);
  }
}
