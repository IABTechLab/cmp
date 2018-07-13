const utils = require('../support/utils');

describe('intro page', () => {

  beforeEach(() => {
    utils.clearCookies();
    browser.waitForAngularEnabled(false);
    browser.get("/");
    browser.sleep(300);
  });

  it('smoke test', () => {
    const url = browser.getCurrentUrl();
    expect(url).toEqual('http://localhost:8080/');
  });

  it('has a page title', () => {
    let el = element.all(by.css('[class^=introV2_title]')).first();
    expect(el.getText()).toContain("Thanks for visiting");
  });

  it('does not write a cookie when Learn More is clicked', () => {
    element(by.css('[class*=introV2_rejectAll]')).click();
    utils.getCookies().then((cookies) => {
      expect(cookies.length).toEqual(0);
    });
  });

  it('writes a cookie when submitted', () => {
    element(by.css('[class*=introV2_acceptAll]')).click();
    utils.getCookies().then((cookies) => {
      expect(cookies.length).toEqual(2);
      for (let i in cookies) {
        let cookie = cookies[i];
        expect(["pubconsent", "euconsent"]).toContain(cookie.name);
        expect(cookie.domain).toEqual("localhost");
        expect(cookie.value).toMatch(/[\w\d\W]+/);
      }
    });
  });
})
