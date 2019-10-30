const utils = require('./support/utils');

describe('intro page', () => {

  beforeEach(() => {
    utils.clearCookies();
    browser.waitForAngularEnabled(false);
    browser.get("/");
    browser.sleep(800);
  });

  it('smoke test', () => {
    const url = browser.getCurrentUrl();
    expect(url).toEqual('http://localhost:8080/');
  });

  it('has a page title', () => {
    const el = element.all(by.css('[class^=introV2_title]')).first();
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
        const cookie = cookies[i];
        expect(["pubconsent", "euconsent"]).toContain(cookie.name);
        expect(cookie.domain).toEqual("localhost");
        expect(cookie.value).toMatch(/[\w\d\W]+/);
      }
    });
  });

  describe('clicking the caret to expand the footer', () => {
    beforeEach(() => {
      element.all(by.css('[class*=footerV2_icon]')).first().click();
      browser.sleep(300);
    })

    it('expands the language at the bottom when the caret icon is clicked', () => {
      const titleEl = element(by.css('[class*=footerV2_headerMessage]'));
      expect(titleEl.getText()).toContain("INFORMATION THAT MAY BE USED:");
      const bodyEl = element(by.css('[class*=footerV2_content]'));
      expect(bodyEl.getText()).toContain("Information about other identifiers assigned to the device");
      expect(bodyEl.getText()).toContain("Ad selection, delivery, reporting");
    });

    describe('properly writes cookies when users interact with the reject and accept buttons after clicking the caret to expand', () => {
      it('reject', () => {
        element(by.name('footerReject')).click();
        utils.getCookies().then((cookies) => {
          expect(cookies.length).toEqual(0);
        });
      });

      it('accept', () => {
        element(by.name('footerAccept')).click();
        utils.getCookies().then((cookies) => {
          expect(cookies.length).toEqual(2);
          for (let i in cookies) {
            const cookie = cookies[i];
            expect(["pubconsent", "euconsent"]).toContain(cookie.name);
            expect(cookie.domain).toEqual("localhost");
            expect(cookie.value).toMatch(/[\w\d\W]+/);
          }
        });
      });
    });
  });

});