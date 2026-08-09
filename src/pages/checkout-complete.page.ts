import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  protected readonly pageUrl = '/checkout-complete.html';

  readonly completeHeader: Locator = this.page.getByTestId('complete-header');
  readonly completeText: Locator = this.page.getByTestId('complete-text');

  protected readonly readyLocator: Locator = this.completeHeader;
}
