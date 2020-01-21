const utils = require('./support/utils');

describe('vendors page', () => {
  beforeEach(() => {
    utils.clearCookies();
    browser.waitForAngularEnabled(false);
    browser.get("/");
    browser.sleep(800);
    element(by.css('[class*=introV2_rejectAll]')).click();
    element.all(by.css('[class*=purposes_vendorLink]')).first().click();
  });

  it('renders the vendors disclaimer', () => {
    const el = element(by.css('[class*=vendors_description]'));
    expect(el.getText()).toContain("Companies carefully selected by us will use your information. " +
      "Depending on the type of data they collect, use, process and other factors, certain companies " +
      "rely on your consent while others require you to opt-out. For information on each partner and to " +
      "exercise your choices, see below. Or to opt-out, visit the NAI, DAA, or EDAA sites.");
  });

  it('select all action toggles all switches', () => {
    const el = element(by.name('selectAll'));
    let switch1 = element.all(by.css('[class*=switch_switch]')).first();
    let switch2 = element.all(by.css('[class*=switch_switch]')).last();
    expect(switch1.getAttribute('class')).toContain('switch_isSelected')
    expect(switch2.getAttribute('class')).toContain('switch_isSelected')
    el.click();
    el.click(); // requires two clicks because the initial state doesn't know how many vendors are selected
    switch1 = element.all(by.css('[class*=switch_switch]')).first();
    switch2 = element.all(by.css('[class*=switch_switch]')).last();
    expect(switch1.getAttribute('class')).not.toContain('switch_isSelected')
    expect(switch2.getAttribute('class')).not.toContain('switch_isSelected')
  });

  describe('vendors table', () => {
    it('renders', () => {
      const table = element(by.css('[class*=vendors_vendorContent]')).element(by.css('[class*=vendors_vendorList]'));
      expect(table.getText()).toContain('Exponential Interactive, Inc');
      expect(table.getText()).toContain('Captify Technologies Limited');
    });

    it('renders links to vendor privacy pages', () => {
      const el = element.all(by.name('vendorLink')).first();
      expect(el.getText()).toContain('Exponential Interactive, Inc');
      expect(el.getAttribute('href')).toContain('http://exponential.com/privacy');
    });
  });


  describe('vendor controls', () => {
    it('clicking a toggle works', () => {
      const switchEl = element.all(by.css('[class*=switch_switch]')).first();
      expect(switchEl.getAttribute('class')).toContain('switch_isSelected')
      switchEl.click();
      expect(switchEl.getAttribute('class')).not.toContain('switch_isSelected')
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
        element.all(by.css('[class*=purposes_vendorLink]')).first().click();

        let vendorCookie2;
        const switchEl = element.all(by.css('[class*=switch_switch]')).first();
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
  });

});