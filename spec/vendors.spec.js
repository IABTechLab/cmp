/* global browser,element,by */
const utils = require('./support/utils');

describe(utils.suiteTitle('Vendors page'), () => {
  beforeEach(() => {
    utils.clearCookies();
    browser.waitForAngularEnabled(false);
    browser.get('/');
    browser.sleep(500);
    element(by.name('footerReject')).click();
    element(by.id('detailsShowVendors')).click();
  });

  it('should render the vendors disclaimer correctly', () => {
    const el = element(by.id('vendorsDescription'));
    expect(el.getText()).toContain(
      'Companies carefully selected by us will use your information. ' +
        'Depending on the type of data they collect, use, process and other factors, certain companies ' +
        'rely on your consent while others require you to opt-out. For information on each partner and to ' +
        'exercise your choices, see below. Or to opt-out, visit the NAI, DAA, or EDAA sites.',
    );
  });

  it('should handle click on select all correctly', () => {
    const el = element(by.id('vendorsSelectAll'));
    const switch1 = element.all(by.css('[class*=switch_switch]')).first();
    const switch2 = element.all(by.css('[class*=switch_switch]')).last();

    expect(switch1.getAttribute('class')).toContain('switch_isSelected');
    expect(switch2.getAttribute('class')).toContain('switch_isSelected');

    el.click();
    el.click(); // requires two clicks because the initial state doesn't know how many vendors are selected

    expect(switch1.getAttribute('class')).not.toContain('switch_isSelected');
    expect(switch2.getAttribute('class')).not.toContain('switch_isSelected');
  });

  it('should render table with vendors correctly', () => {
    const table = element(by.css('[class*=vendortable_vendorTable]'));
    expect(table.getText()).toContain('Globex');
    expect(table.getText()).toContain('Initech');
  });

  it('should render links to vendor pages correctly', () => {
    const el = element(by.css('[class*=vendortable_vendorTable]'))
      .all(by.tagName('a'))
      .first();
    expect(el.getText()).toContain('Globex');
    expect(el.getAttribute('href')).toContain('www.example.com');
  });

  it('should handle clicking a toggle correctly', () => {
    const switchEl = element.all(by.css('[class*=switch_switch]')).first();
    expect(switchEl.getAttribute('class')).toContain('switch_isSelected');
    switchEl.click();
    expect(switchEl.getAttribute('class')).not.toContain('switch_isSelected');
  });

  it('clicking a toggle and submitting changes the cookie', () => {
    element(by.name('detailsSave')).click();

    let vendorCookie1;
    utils.getCookies().then(firstCookies => {
      expect(firstCookies.length).toEqual(2);
      for (let i in firstCookies) {
        const cookie = firstCookies[i];
        if (cookie.name === 'euconsent') vendorCookie1 = cookie.value;
      }

      utils.clearCookies();
      browser.get('/');
      browser.sleep(300);

      element(by.name('footerReject')).click();
      element(by.id('detailsShowVendors')).click();

      let vendorCookie2;
      const switchEl = element.all(by.css('[class*=switch_switch]')).first();
      switchEl.click();
      element(by.name('detailsSave')).click();
      utils.getCookies().then(secondCookies => {
        expect(secondCookies.length).toEqual(2);
        for (let i in secondCookies) {
          const cookie = secondCookies[i];
          if (cookie.name === 'euconsent') vendorCookie2 = cookie.value;
          expect(['pubconsent', 'euconsent']).toContain(cookie.name);
          expect(cookie.domain).toEqual('localhost');
          expect(cookie.value).toMatch(/[\w\d\W]+/);
        }
        expect(vendorCookie1).not.toEqual(vendorCookie2);
      });
    });
  });
});
