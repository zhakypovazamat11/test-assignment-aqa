import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutStepTwoPage extends BasePage {
  protected readonly pageUrl = '/checkout-step-two.html';

  readonly subtotalLabel: Locator = this.page.getByTestId('subtotal-label');
  readonly taxLabel: Locator = this.page.getByTestId('tax-label');
  readonly totalLabel: Locator = this.page.getByTestId('total-label');
  readonly finishButton: Locator = this.page.getByTestId('finish');

  protected readonly readyLocator: Locator = this.finishButton;

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
