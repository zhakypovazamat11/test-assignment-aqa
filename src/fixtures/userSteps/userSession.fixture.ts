import { test as base } from '../pages.fixtures';
import { InventoryPage } from '../../pages/inventory.page';
import { STANDARD_USER_USERNAME, STANDARD_USER_PASSWORD } from '../../config/required-env-vars';

type UserSteps = {
  authorizedUser: InventoryPage;
};

export const test = base.extend<UserSteps>({
  authorizedUser: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.openPage();
    await loginPage.login(STANDARD_USER_USERNAME, STANDARD_USER_PASSWORD);
    await inventoryPage.verifyPageIsOpened();
    await use(inventoryPage);
  },
});

export { expect } from '../pages.fixtures';
