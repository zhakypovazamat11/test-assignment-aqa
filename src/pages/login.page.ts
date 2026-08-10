import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly pageUrl = '/';

  private readonly usernameInput: Locator = this.page.getByTestId('username');
  private readonly passwordInput: Locator = this.page.getByTestId('password');
  private readonly loginButton: Locator = this.page.getByTestId('login-button');
  private readonly errorMessage: Locator = this.page.getByTestId('error');
  private readonly errorCloseButton: Locator = this.page.getByTestId('error-button');

  protected readonly readyLocator: Locator = this.loginButton;

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async closeError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  async verifyErrorMessage(expectedText: string): Promise<void> {
    await this.expectText(this.errorMessage, expectedText);
  }

  async verifyErrorVisible(): Promise<void> {
    await this.expectVisible(this.errorMessage);
  }

  async verifyErrorHidden(): Promise<void> {
    await expect(this.errorMessage).toBeHidden();
  }
}
