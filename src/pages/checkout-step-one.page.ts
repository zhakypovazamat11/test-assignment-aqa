import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutStepOnePage extends BasePage {
  protected readonly pageUrl = '/checkout-step-one.html';

  private readonly firstNameInput: Locator = this.page.getByTestId('firstName');
  private readonly lastNameInput: Locator = this.page.getByTestId('lastName');
  private readonly postalCodeInput: Locator = this.page.getByTestId('postalCode');
  private readonly continueButton: Locator = this.page.getByTestId('continue');

  protected readonly readyLocator: Locator = this.continueButton;

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout(): Promise<void> {
    await this.continueButton.click();
  }
}
