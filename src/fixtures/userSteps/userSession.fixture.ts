import { test as base } from '../pages.fixtures';
import { InventoryPage } from '../../pages/inventory.page';

const STANDARD_USER_USERNAME = process.env.STANDARD_USER_USERNAME;
const STANDARD_USER_PASSWORD = process.env.STANDARD_USER_PASSWORD;

type UserSteps = {
  authorizedUser: InventoryPage;
};

export const test = base.extend<UserSteps>({
  authorizedUser: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.openPage();
    await loginPage.login(STANDARD_USER_USERNAME!, STANDARD_USER_PASSWORD!);
    await inventoryPage.verifyPageIsOpened();
    await use(inventoryPage);
  },
});

export { expect } from '../pages.fixtures';
