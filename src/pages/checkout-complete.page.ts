import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  protected readonly pageUrl = '/checkout-complete.html';

  private readonly completeHeader: Locator = this.page.getByTestId('complete-header');

  protected readonly readyLocator: Locator = this.completeHeader;

  async verifyConfirmationMessage(expectedText: string): Promise<void> {
    await this.expectText(this.completeHeader, expectedText);
  }
}
