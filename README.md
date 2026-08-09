# Saucedemo.com E2E Tests

## Task description
На примере любого сайта необходимо
1. Настроить проект с нуля
Playwright + TypeScript, чистая структура репозитория.
Конфигурация под несколько окружений через переменные (BASE_URL и т.п.).
2. Реализовать архитектуру
Page Object Model + выделить хотя бы 1–2 переиспользуемых компонента (Component Object) — например, шапка сайта с поиском/корзиной, которая встречается на разных страницах.
3. Покрыть сценарии тестами
Позитивный E2E-флоу: регистрация/логин → добавление товара в корзину → оформление заказа.
Негативный сценарий: попытка логина с неверными данными / валидация формы — проверка корректной обработки ошибки.
5. Документация
README NOTE: как запустить, какие решения приняты и почему, какие есть ограничения/что не успели.

## Technical Stack

Playwright + TypeScript

## Project Structure

```
src/
  pages/
    base.page.ts                 # shared contract: openPage(), verifyPageIsOpened()
    login.page.ts                 # "/"
    inventory.page.ts             # "/inventory.html"
    cart.page.ts                  # "/cart.html"
    checkout-step-one.page.ts     # "/checkout-step-one.html"
    checkout-step-two.page.ts     # "/checkout-step-two.html"
    checkout-complete.page.ts     # "/checkout-complete.html"
    components/
      header.component.ts         # burger menu + cart — on inventory/cart/checkout-*
      product-item.component.ts   # product card on inventory, repeats N times
  fixtures/
    pages.fixtures.ts             # injects page objects into tests
    userSteps/
      userSession.fixture.ts      # authorizedUser: logs in and yields InventoryPage
  test-data/
    checkout-info.ts              # random data generator for the checkout form
tests/
  purchase-flow.spec.ts           # positive E2E flow
  login-negative.spec.ts          # negative login scenarios
```

- **`BasePage`** — an abstract class: a page is opened via `openPage()`, and
  `verifyPageIsOpened()` checks the URL and the visibility of an "anchor"
  locator. All POM classes extend it.
- **`HeaderComponent`** — the header component (burger menu with Logout +
  cart icon/badge), present on several different pages. This is Component
  Object #1 from the task.
- **`ProductItemComponent`** — a product card, parameterized by name
  (`page.locator('.inventory_item', { hasText: name })`). Demonstrates a
  component pattern that repeats many times on a single page, not just
  across pages — Component Object #2.
- **`fixtures/pages.fixtures.ts`** — a single place that creates and injects
  all page objects into tests.
- **`fixtures/userSteps/userSession.fixture.ts`** — a higher-level
  `authorizedUser` fixture built on top of `pages.fixtures.ts`: it logs in
  with the standard user (credentials read from `process.env`) and yields
  an already-authenticated `InventoryPage`, so tests that don't cover the
  login flow itself (e.g. `purchase-flow.spec.ts`) can skip repeating the
  login steps.

Locators were taken from the site's actual DOM (inspected in a real browser)
— almost all interactive elements on saucedemo.com have a `data-test`
attribute. `playwright.config.ts` sets `testIdAttribute: 'data-test'`, so
`page.getByTestId(...)` is used everywhere instead of
`page.locator('[data-test="..."]')`.

## Install

```bash
npm install
npx playwright install chromium   # if the browser isn't installed yet
cp .env.example .env              # adjust values if needed
```

### Environment Variables

Set in `.env` (see `.env.example`), never hardcoded in code/tests:

| Variable                     | Purpose                                    |
| ----------------------------- | ------------------------------------------- |
| `BASE_URL`                    | base URL of the application under test     |
| `STANDARD_USER_USERNAME`      | valid user for the positive flow           |
| `STANDARD_USER_PASSWORD`      | password of the valid user                 |
| `LOCKED_OUT_USER_USERNAME`    | locked-out user for the negative scenario  |

To switch environments, use the `ENV_FILE` variable, e.g.:

```bash
ENV_FILE=.env.staging npx playwright test
```

`.env` is used by default.

## Run Tests

```bash
npm test               # run all tests (headless)
npm run test:headed    # with a visible browser
npm run test:ui        # Playwright UI mode
```

View the report after a run: `npx playwright show-report`.

## Lint & Format

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## What Is Covered

### Positive: `purchase-flow.spec.ts`

Login → add 2 products to the cart (with a cart badge check in
`HeaderComponent`) → go to cart → checkout (steps 1 and 2 with a summary
check) → order confirmation page.

### Negative: `login-negative.spec.ts`

- invalid password
- locked-out user (`locked_out_user`)
- empty username / empty password
- error message can be dismissed via the close button

In every case it's also verified that login did not happen (the URL stays on `/`).

## Design Decisions

- **`trace: 'retain-on-failure'`** instead of `'on'` — traces are kept only
  for failed tests, avoiding artifact bloat on green runs while still
  keeping a full trace to debug failures.
- **Only chromium** is enabled in the config (firefox/webkit are commented
  out) — cross-browser coverage isn't required by the task, but the pattern
  for enabling it is shown.
- **Credentials and `BASE_URL` are env-only**, never hardcoded in
  tests/POMs, so configuring different environments doesn't require code
  changes.
- **`@faker-js/faker`** is used to generate checkout form data
  (`test-data/checkout-info.ts`), following the reference project's
  approach, instead of hardcoded values.
- **CI (`.github/workflows/playwright.yml`)** — two jobs: `lint` (ESLint +
  `tsc --noEmit`) and a dependent `test` job (Playwright against chromium),
  which uploads the HTML report as an artifact.
