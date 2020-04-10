const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
});

afterEach(async () => {
  await page.close();
});

test('When logged in, can see blog create form', async () => {
  await page.login();
  await page.click('a.btn-floating');

  const label = await page.getContentsOf('form label');

  expect(label).toEqual('Blog Title');
});

describe('When logged in ', async () => {
  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });
    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });
    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('And using invalid inputs, ', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      expect(titleError).toBe('You must provide a value');
      expect(contentError).toBe('You must provide a value');
    });
  });
});

describe('User is not logged in', async () => {
  test('user cannot create blog post', async () => {
    const result = await page.evaluate(async () => {
      return fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        protocol: 'http',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'My Title', content: 'My Content' }),
      }).then((res) => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('user cannot get list of posts', async () => {
    const result = await page.evaluate(() => {
      return fetch('http://localhost:5000/api/blogs', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
    });
    expect(result).toEqual({ error: 'You must log in!' });
  });
});
