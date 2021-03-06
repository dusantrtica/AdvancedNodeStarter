const puppeteer = require('puppeteer');
const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');
class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      // args: ['--disable-dev-shm-usage', '--shm-size=1gb'],
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });

    // moramo reload da bi se izmene primenile
    await this.page.goto('http://localhost:3000/blogs');

    // moramo da cekamo da se stranica renderuje, ne mozemo samo da rokamo
    // naredbe
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }
}

module.exports = CustomPage;
