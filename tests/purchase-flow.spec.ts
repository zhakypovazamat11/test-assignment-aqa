import { test, expect } from '../src/fixtures/userSteps/userSession.fixture';
import { generateCheckoutInfo } from '../src/test-data/checkout-info';

const ORDER_CONFIRMATION_MESSAGE = 'Thank you for your order!';

test.describe('Purchase flow', () => {
  test('Verify user can add products to cart and complete checkout', async ({
    authorizedUser: inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }, testInfo) => {
    const PRODUCTS = await inventoryPage.getRandomProductNames(2);
    await testInfo.attach('selected-products', { body: PRODUCTS.join(', ') });

    await test.step('Add products to cart', async () => {
      for (const [index, name] of PRODUCTS.entries()) {
        await inventoryPage.product(name).addToCart();
        await expect(inventoryPage.header.cartBadge).toHaveText(String(index + 1));
      }
    });

    await test.step('Verify cart contents', async () => {
      await inventoryPage.header.openCart();
      await cartPage.verifyPageIsOpened();
      for (const name of PRODUCTS) {
        await expect(cartPage.cartItemNames.filter({ hasText: name })).toBeVisible();
      }
    });

    await test.step('Fill in checkout information', async () => {
      await cartPage.checkout();
      await checkoutStepOnePage.verifyPageIsOpened();

      const checkoutInfo = generateCheckoutInfo();
      await checkoutStepOnePage.fillInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode,
      );
      await checkoutStepOnePage.continueCheckout();
    });

    await test.step('Complete the order', async () => {
      await checkoutStepTwoPage.verifyPageIsOpened();
      await expect(checkoutStepTwoPage.totalLabel).toBeVisible();
      await checkoutStepTwoPage.finish();

      await checkoutCompletePage.verifyPageIsOpened();
      await expect(checkoutCompletePage.completeHeader).toHaveText(ORDER_CONFIRMATION_MESSAGE);
      await expect(inventoryPage.header.cartBadge).toBeHidden();
    });
  });
});
