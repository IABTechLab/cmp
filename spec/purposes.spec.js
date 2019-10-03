const utils = require('./support/utils');

describe('purposes page', () => {
  beforeEach(() => {
    utils.clearCookies();
    browser.waitForAngularEnabled(false);
    browser.get("/");
    browser.sleep(300);
    element(by.css('[class*=introV2_rejectAll]')).click();
  });

  it('renders the title', () => {
    const el = element(by.css('[class*=details_title]'));
    expect(el.getText()).toContain("PRIVACY PREFERENCES");
  });

  it('renders the disclaimer', () => {
    const el = element(by.css('[class*=purposes_disclaimer]'));
    expect(el.getText()).toContain('We and selected companies may access and use information ' +
      'for the purposes outlined. You may customise your choice or continue using our site ' +
      'if you are OK with the purposes. You can see the complete list of companies here.');
  });

  describe('properly writes cookies when users interact with the accept button', () => {
    beforeEach(() => {
      utils.getCookies().then((cookies) => {
        expect(cookies.length).toEqual(0);
      });
    })

    it('accept', () => {
      element(by.css('[class*=details_save]')).click();
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

  describe('renders the controls at the bottom', () => {
    it('show all companies', () => {
      const el = element(by.css('[class*=details_vendorLink]'));
      expect(el.getText()).toContain('Show all companies');
    });

    it('go back', () => {
      const el = element(by.css('[class*=details_cancel]'));
      expect(el.getText()).toContain('Back');
    });

    it('submit button', () => {
      const el = element(by.css('[class*=details_save]'));
      expect(el.getText()).toContain('OK, CONTINUE TO SITE');
    });
  });

  describe('renders the purpose list', () => {
    it('lists standard purposes', () => {
      const purposeList = element(by.css('[class*=purposes_purposeList]'));
      expect(purposeList.getText()).toContain('Storage and access of information');
      expect(purposeList.getText()).toContain('Measurement');
    });

    it('lists custom purposes', () => {
      const purposeList = element(by.css('[class*=purposes_purposeList]'));
      expect(purposeList.getText()).toContain('Custom Purpose 1');
      expect(purposeList.getText()).toContain('Custom Purpose 2');
    });

    describe('interactions with the purpose list', () => {
      it('highlighted purposes have explanatory text', () => {
        const el = element(by.css('[class*=purposes_body]'));
        expect(el.getText()).toContain("The storage of information, or access to information that is already stored, on your device such as accessing advertising identifiers and/or other device identifiers, and/or using cookies or similar technologies.");
        expect(el.getText()).not.toContain("The collection and processing of information about your use of this site to subsequently personalize advertising for you in other contexts, i.e. on other sites or apps, over time. Typically, the content of the site or app is used to make inferences about your interests which inform future selections.");
      });

      it('clicking on an unselected purpose selects it', () => {
        let el = element(by.css('[class*=purposes_body]'));
        expect(el.getText()).toContain("The storage of information, or access to information that is already stored, on your device such as accessing advertising identifiers and/or other device identifiers, and/or using cookies or similar technologies.");
        const purposes = element.all(by.css("[class*=purposes_purposeItem]"));
        purposes.get(1).click();
        el = element(by.css('[class*=purposes_body]'));
        expect(el.getText()).toContain("The collection and processing of information about your use of this site to subsequently personalize advertising for you in other contexts, i.e. on other sites or apps, over time. Typically, the content of the site or app is used to make inferences about your interests which inform future selections.");
        expect(el.getText()).not.toContain("The storage of information, or access to information that is already stored, on your device such as accessing advertising identifiers and/or other device identifiers, and/or using cookies or similar technologies.");
      });
    });
  });

  describe('purpose controls', () => {
    it('clicking a toggle works', () => {
      const switchEl = element(by.css('[class*=switch_switch]'));
      const parentEl = element(by.css('[class*=purposes_active]'));
      expect(switchEl.getAttribute('class')).toContain('switch_isSelected')
      expect(parentEl.getText()).not.toContain('Inactive')
      switchEl.click();
      expect(switchEl.getAttribute('class')).not.toContain('switch_isSelected')
      expect(parentEl.getText()).toContain('Inactive')
    });

    it('clicking a toggle and submitting changes the cookie', () => {
      element(by.css('[class*=details_save]')).click();
      let vendorCookie1;
      utils.getCookies().then((firstCookies) => {
        expect(firstCookies.length).toEqual(2);
        for (let i in firstCookies) {
          const cookie = firstCookies[i];
          if (cookie.name === 'euconsent') vendorCookie1 = cookie.value;
        }

        utils.clearCookies();

        browser.get("/");
        browser.sleep(300);
        element(by.css('[class*=introV2_rejectAll]')).click();

        let vendorCookie2;
        const switchEl = element(by.css('[class*=switch_switch]'));
        switchEl.click();
        element(by.css('[class*=details_save]')).click();
        utils.getCookies().then((secondCookies) => {
          expect(secondCookies.length).toEqual(2);
          for (let i in secondCookies) {
            const cookie = secondCookies[i];
            if (cookie.name === 'euconsent') vendorCookie2 = cookie.value;
            expect(["pubconsent", "euconsent"]).toContain(cookie.name);
            expect(cookie.domain).toEqual("localhost");
            expect(cookie.value).toMatch(/[\w\d\W]+/);
          }
          expect(vendorCookie1).not.toEqual(vendorCookie2);
        });
      });
    });

    it('clicking show companies expands the list of companies', () => {
      expect(element(by.css('[class*=purposes_vendorList]')).isPresent()).toBe(false);
      element(by.css('[class*=purposes_body]')).element(by.css('[class*=purposes_vendorLink]')).click();
      browser.sleep(300);
      expect(element(by.css('[class*=purposes_vendorList]')).isPresent()).toBe(true);
    });
  });

});