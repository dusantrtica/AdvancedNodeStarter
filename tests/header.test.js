const puppeteer = require('puppeteer');

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
