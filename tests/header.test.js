const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('We can launch a browser', async () => {
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
  expect(text).toBe('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();
  console.log({ url });
  expect(url.includes('accounts.google.com'));
});

test('When signed in, shows logout button', async () => {
  const id = '5e7c92a184f4a83603bfaad0';
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);
  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sig });

  // moramo reload da bi se izmene primenile
  await page.goto('localhost:3000');

  // moramo da cekamo da se stranica renderuje, ne mozemo samo da rokamo
  // naredbe
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual('Logout');
});
