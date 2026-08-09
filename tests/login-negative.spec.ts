import { test, expect } from '../src/fixtures/pages.fixtures';

const STANDARD_USER_USERNAME = process.env.STANDARD_USER_USERNAME;
const STANDARD_USER_PASSWORD = process.env.STANDARD_USER_PASSWORD;
const LOCKED_OUT_USER_USERNAME = process.env.LOCKED_OUT_USER_USERNAME;

const WRONG_PASSWORD = 'wrong_password';

const ERROR_MESSAGES = {
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOutUser: 'Epic sadface: Sorry, this user has been locked out.',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
} as const;

type LoginCase = {
  name: string;
  username: string;
  password: string;
  expectedError: string;
};

const LOGIN_CASES: LoginCase[] = [
  {
    name: 'invalid password',
    username: STANDARD_USER_USERNAME!,
    password: WRONG_PASSWORD,
    expectedError: ERROR_MESSAGES.invalidCredentials,
  },
  {
    name: 'locked out user',
    username: LOCKED_OUT_USER_USERNAME!,
    password: STANDARD_USER_PASSWORD!,
    expectedError: ERROR_MESSAGES.lockedOutUser,
  },
  {
    name: 'empty username',
    username: '',
    password: STANDARD_USER_PASSWORD!,
    expectedError: ERROR_MESSAGES.usernameRequired,
  },
  {
    name: 'empty password',
    username: STANDARD_USER_USERNAME!,
    password: '',
    expectedError: ERROR_MESSAGES.passwordRequired,
  },
];

test.describe('Login negative scenarios', () => {
  LOGIN_CASES.forEach(({ name, username, password, expectedError }) => {
    test(`shows error: ${name}`, async ({ loginPage }) => {
      await loginPage.openPage();
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(expectedError);
      await loginPage.verifyPageIsOpened();
    });
  });

  test('error message can be dismissed', async ({ loginPage }) => {
    await loginPage.openPage();
    await loginPage.login(STANDARD_USER_USERNAME!, WRONG_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.closeError();
    await expect(loginPage.errorMessage).toBeHidden();
  });
});
