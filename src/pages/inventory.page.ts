import { Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { ProductItemComponent } from './components/product-item.component';

export class InventoryPage extends BasePage {
  protected readonly pageUrl = '/inventory.html';

  private readonly title: Locator = this.page.getByTestId('title');
  readonly header: HeaderComponent = new HeaderComponent(this.page);

  protected readonly readyLocator: Locator = this.title;
  private readonly itemNames: Locator = this.page.locator('.inventory_item_name');

  product(name: string): ProductItemComponent {
    return new ProductItemComponent(this.page, name);
  }

  private async getAllProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getRandomProductNames(count: number): Promise<string[]> {
    const allProductNames = await this.getAllProductNames();
    return faker.helpers.arrayElements(allProductNames, count);
  }
}
