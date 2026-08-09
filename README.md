# E2E-тесты для saucedemo.com

Playwright + TypeScript, Page Object Model + Component Object.

Сайт: [https://www.saucedemo.com/](https://www.saucedemo.com/) — учебный
демо-магазин от Sauce Labs. Выбран потому что стабилен, не имеет внешних
редиректов на реальные платёжные шлюзы и содержит готовый набор тестовых
пользователей (включая `locked_out_user` для негативного сценария).

Покрытый флоу: логин → добавление товаров в корзину → оформление заказа
(позитивный сценарий), плюс проверка обработки ошибок логина (негативные
сценарии).

## Установка и запуск

```bash
npm install
npx playwright install chromium   # если браузер ещё не установлен
cp .env.example .env               # при необходимости поменять значения
npm test                           # прогон всех тестов (headless)
npm run test:headed                # с видимым браузером
npm run test:ui                    # Playwright UI mode
npm run lint                       # ESLint
npm run typecheck                  # tsc --noEmit
```

Отчёт после прогона: `npx playwright show-report`.

### Переменные окружения

Задаются в `.env` (см. `.env.example`), не хардкодятся в коде/тестах:

| Переменная         | Назначение                                   |
| ------------------ | --------------------------------------------- |
| `BASE_URL`                | базовый URL приложения под тест              |
| `STANDARD_USER_USERNAME`  | валидный пользователь для позитивного флоу   |
| `STANDARD_USER_PASSWORD`  | пароль валидного пользователя                |
| `LOCKED_OUT_USER_USERNAME`| заблокированный пользователь для негатива    |

Для переключения окружений — переменная `ENV_FILE`, например:

```bash
ENV_FILE=.env.staging npx playwright test
```

По умолчанию используется `.env`.

## Архитектура

```
src/
  pages/
    base.page.ts                 # общий контракт: openPage(), verifyPageIsOpened()
    login.page.ts                 # "/"
    inventory.page.ts             # "/inventory.html"
    cart.page.ts                  # "/cart.html"
    checkout-step-one.page.ts     # "/checkout-step-one.html"
    checkout-step-two.page.ts     # "/checkout-step-two.html"
    checkout-complete.page.ts     # "/checkout-complete.html"
    components/
      header.component.ts         # бургер-меню + корзина — на inventory/cart/checkout-*
      product-item.component.ts   # карточка товара на inventory, повторяется N раз
  fixtures/
    pages.fixtures.ts             # инъекция page-объектов и credentials из env в тесты
  test-data/
    checkout-info.ts              # генератор случайных данных для формы checkout
tests/
  purchase-flow.spec.ts           # позитивный E2E
  login-negative.spec.ts          # негативные сценарии логина
```

- **`BasePage`** — абстрактный класс: страница открывается через `openPage()`,
  а `verifyPageIsOpened()` проверяет URL и видимость "якорного" локатора.
  Все POM-классы наследуются от него.
- **`HeaderComponent`** — компонент шапки (бургер-меню с Logout + иконка/бейдж
  корзины), встречается на нескольких разных страницах. Это и есть
  Component Object №1 из задания.
- **`ProductItemComponent`** — карточка товара, параметризуется названием
  (`page.locator('.inventory_item', { hasText: name })`). Показывает паттерн
  компонента, который повторяется многократно на одной странице, а не
  только между страницами — Component Object №2.
- **`fixtures/pages.fixtures.ts`** — единая точка, которая создаёт
  page-объекты и передаёт креды из `process.env`, чтобы тесты не обращались
  к `process.env` напрямую.

Локаторы взяты из реального DOM сайта (запускал браузер и снимал разметку) —
почти все интерактивные элементы на saucedemo.com имеют атрибут `data-test`.
В `playwright.config.ts` он задан как `testIdAttribute: 'data-test'`, поэтому
везде используется `page.getByTestId(...)` вместо `page.locator('[data-test="..."]')`.

## Тестовые сценарии

### Позитивный: `purchase-flow.spec.ts`

Логин → добавление 2 товаров в корзину (с проверкой бейджа корзины в
`HeaderComponent`) → переход в корзину → checkout (шаги 1 и 2 с проверкой
summary) → страница подтверждения заказа.

### Негативный: `login-negative.spec.ts`

- неверный пароль
- заблокированный пользователь (`locked_out_user`)
- пустой username / пустой password
- сообщение об ошибке можно закрыть по крестику

Во всех случаях также проверяется, что логин не произошёл (URL остался на `/`).

## Принятые решения

- **`trace: 'retain-on-failure'`** вместо `'on'` — трейсы сохраняются только
  для упавших тестов, чтобы не плодить артефакты на зелёных прогонах, но при
  падении есть весь трейс для разбора.
- **Только chromium** активен в конфиге (firefox/webkit закомментированы) —
  кросс-браузерность не требуется заданием, но паттерн включения показан.
- **Креды и `BASE_URL` — только через env**, не хардкодятся в тестах/POM,
  чтобы конфигурация под разные окружения не требовала правки кода.
- **`@faker-js/faker`** для генерации данных формы checkout
  (`test-data/checkout-info.ts`) — по аналогии с текущим проектом, вместо
  захардкоженных значений.
- **CI (`.github/workflows/playwright.yml`)** — два джоба, `lint` (ESLint +
  `tsc --noEmit`) и зависящий от него `test` (Playwright против chromium),
  с загрузкой HTML-отчёта как артефакта.
