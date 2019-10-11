const utils = require('./support/utils');

describe('purposes page', () => {
  beforeEach(() => {
    utils.clearCookies();
    browser.driver.manage().window().maximize();
    browser.waitForAngularEnabled(false);
    browser.get("/");
    browser.sleep(800);
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
      expect(purposeList.getAttribute('innerText')).toContain('Information storage and access');
      expect(purposeList.getAttribute('innerText')).toContain('Measurement');
    });

    it('lists custom purposes', () => {
      const purposeList = element(by.css('[class*=purposes_purposeList]'));
      expect(purposeList.getText()).toContain('Custom Purpose 1');
      expect(purposeList.getText()).toContain('Custom Purpose 2');
    });

    describe('interactions with the purpose list', () => {
      it('highlighted purposes have explanatory text', () => {
        const el = element(by.css('[class*=purposes_body]'));
        expect(el.getAttribute('innerText')).toContain("The storage of information, or access to information that is already stored, on your device such as advertising identifiers, device identifiers, cookies, and similar technologies.");
        expect(el.getAttribute('innerText')).not.toContain("The collection and processing of information about your use of this site to subsequently personalize advertising for you in other contexts, i.e. on other sites or apps, over time. Typically, the content of the site or app is used to make inferences about your interests which inform future selections.");
      });

      it('clicking on an unselected purpose selects it', () => {
        let el = element(by.css('[class*=purposes_body]'));
        expect(el.getAttribute('innerText')).toContain("The storage of information, or access to information that is already stored, on your device such as advertising identifiers, device identifiers, cookies, and similar technologies.");
        const purposes = element.all(by.css("[class*=purposes_purposeItem]"));
        purposes.get(1).click();
        el = element(by.css('[class*=purposes_body]'));
        expect(el.getAttribute('innerText')).toContain("The collection and processing of information about your use of this service to subsequently personalise advertising and/or content for you in other contexts, such as on other websites or apps, over time. Typically, the content of the site or app is used to make inferences about your interests, which inform future selection of advertising and/or content.");
        expect(el.getAttribute('innerText')).not.toContain("The storage of information, or access to information that is already stored, on your device such as advertising identifiers, device identifiers, cookies, and similar technologies.");
      });
    });
  });

  describe('purpose controls', () => {
    it('clicking a toggle works', async () => {
      const switchEl = element(by.css('[class*=switch_switch]'));
      const parentEl = element(by.css('[class*=purposes_active]'));
      expect(switchEl.getAttribute('class')).toContain('switch_isSelected');
      expect(parentEl.getText()).not.toContain('Inactive');
      await browser.executeScript('arguments[0].click()', switchEl);
      
      browser.sleep(800);
      expect(switchEl.getAttribute('class')).not.toContain('switch_isSelected');
      expect(parentEl.getAttribute('innerText')).toContain('Inactive');
    });

    it('clicking a toggle and submitting changes the cookie', () => {
      element(by.css('[class*=details_save]')).click();
      browser.sleep(800);
      let vendorCookie1;
      utils.getCookies().then( async (firstCookies) => {
        expect(firstCookies.length).toEqual(2);
        for (let i in firstCookies) {
          const cookie = firstCookies[i];
          if (cookie.name === 'euconsent') vendorCookie1 = cookie.value;
        }

        utils.clearCookies();

        browser.get("/");
        browser.sleep(800);
        element(by.css('[class*=introV2_rejectAll]')).click();
        browser.sleep(800);
        let vendorCookie2;
        const switchEl = element(by.css('[class*=switch_switch]'));
        await browser.executeScript('arguments[0].click()', switchEl);
        
        browser.sleep(800);
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

    it('clicking show companies expands the list of companies', async () => {
      expect(element(by.css('[class*=purposes_vendorList]')).isPresent()).toBe(false);
      const vendorLink = element(by.css('[class*=purposes_body]')).element(by.css('[class*=purposes_vendorLink]'));
      await browser.executeScript('arguments[0].click()', vendorLink);
      browser.sleep(800);
      expect(element(by.css('[class*=purposes_vendorList]')).isPresent()).toBe(true);
    });
  });

});