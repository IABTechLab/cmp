const utils = require('../support/utils.js');

describe('intro page', () => {

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    browser.get("/");
  });

  it('smoke test', () => {
    const url = browser.getCurrentUrl();
    expect(url).toEqual('http://localhost:8080/')
  });

  it('has a page title', () => {
    browser.sleep(300);
    let el = element(by.css('[class^=introV2_title]'))
    expect(el.getText()).toContain("Thanks for visiting")
  })
})
