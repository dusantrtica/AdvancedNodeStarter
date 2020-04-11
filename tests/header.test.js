const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('We can launch a browser', async () => {
  const text = await page.getContentsOf('a.brand-logo', (el) => el.innerHTML);
  expect(text).toBe('Blogster');
}, 10000);

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url.includes('accounts.google.com'));
}, 10000);

test('When signed in, shows logout button', async () => {
  await page.login();
  const text = await page.getContentsOf(
    'a[href="/auth/logout"]',
    (el) => el.innerHTML,
  );
  expect(text).toEqual('Logout');
}, 10000);
