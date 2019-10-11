const utils = require('./support/utils');

describe('different configurations', () => {

  beforeEach(() => {
    utils.clearCookies();
    browser.waitForAngularEnabled(false);
  });

  describe('Layout - Modal', () => {
    beforeEach(() => {
      browser.driver.manage().window().maximize();
      browser.get("/e2e/layout-modal.html");
      browser.sleep(800);
    });

    it('has a page title', () => {
      const el = element.all(by.css('[class^=intro_title]')).first();
      browser.wait(protractor.ExpectedConditions.visibilityOf(el), 2000);   
      expect(el.getAttribute('innerText')).toContain("Thanks for visiting");
    });

    it('does not write a cookie when Learn More is clicked', () => {
      const el = element(by.css('[class*=intro_rejectAll]'));
      browser.wait(protractor.ExpectedConditions.visibilityOf(el), 2000); 
      el.click();
      utils.getCookies().then((cookies) => {
        expect(cookies.length).toEqual(0);
      });
    });

    it('writes a cookie when submitted', () => {
      const el = element(by.css('[class*=intro_acceptAll]'));
      browser.wait(protractor.ExpectedConditions.visibilityOf(el), 2000);
      el.click()
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
        const el = element.all(by.css('[class*=footer_icon]')).first();
        browser.wait(protractor.ExpectedConditions.visibilityOf(el), 2000);
        el.click()
        browser.sleep(300);
      })

      it('expands the language at the bottom when the caret icon is clicked', () => {
        const titleEl = element(by.css('[class*=footer_headerMessage]'));
        expect(titleEl.getText()).toContain("INFORMATION THAT MAY BE USED:");
        const bodyEl = element(by.css('[class*=footer_content]'));
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

  describe('Layout - Thin', () => {
    beforeEach(() => {
      browser.get("/e2e/layout-thin.html");
      browser.sleep(300);
    });

    it('does NOT have a page title', () => {
      expect(browser.isElementPresent(element(by.css('[class^=introThin_title]')))).toEqual(false);
    });

    it('writes a cookie when submitted', () => {
      element(by.css('[class*=introThin_acceptAll]')).click();
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

  describe('Company Name', () => {
    beforeEach(() => {
      browser.get("/e2e/company_name.html");
      browser.sleep(300);
    });

    it('title contains the company name specified in the config', () => {
      const el = element.all(by.css('[class^=intro_title]')).first();
      expect(el.getText()).toContain("Roadrunner and Coyote Enterprises");
    });
  });

});