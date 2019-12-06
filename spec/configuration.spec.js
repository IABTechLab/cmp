/* global browser,element,by */
const utils = require("./support/utils");
const protractor = require("protractor");
const translations = require("../src/lib/translations");

const { browser, element, by } = protractor;

const cssColor = "rgba(0, 0, 255, 1)";

describe(utils.suiteTitle("Configuration"), () => {
	beforeEach(() => {
		utils.clearCookies();
		browser.waitForAngularEnabled(false);
	});

	// Layout
	it("should display correctly when layout is set to modal", () => {
		browser.get("/?layout=modal");
		browser.sleep(500);

		const popup = element(by.css("[class^=CMP_popup_content]"));
		const el = element(by.css("[class^=CMP_title_title]"));
		const acceptBtn = element(by.name("footerAccept"));
		const learnMoreBtn = element(by.name("footerReject"));
		const showSummaryBtn = element(by.name("ctrl"));

		browser.wait(protractor.ExpectedConditions.visibilityOf(el), 1000);
		expect(el.getText()).toContain(translations.en.intro.title);
		expect(browser.isElementPresent(acceptBtn)).toEqual(true);
		expect(browser.isElementPresent(learnMoreBtn)).toEqual(true);
		expect(browser.isElementPresent(showSummaryBtn)).toEqual(true);

		Promise.all([
			popup.getSize(),
			popup.getLocation(),
			browser.driver
				.manage()
				.window()
				.getSize()
		]).then(([size, location, browserSize]) => {
			// check size of the modal
			expect(size.width).toEqual(520);
			expect(size.height).toBeLessThanOrEqual(560);

			// check position of the modal
			expect(location.x).toBe((browserSize.width - size.width) / 2);
			// Firefox task bar height is 74px
			// expect(location.y).toBe((browserSize.height - size.height) / 2);
		});
	});

	it("should display correctly when layout is set to footer", () => {
		browser.get("/?layout=footer");
		browser.sleep(500);

		const popup = element(by.css("[class^=CMP_popup_content]"));
		const el = element(by.css("[class^=CMP_title_title]"));
		const acceptBtn = element(by.name("footerAccept"));
		const learnMoreBtn = element(by.name("footerReject"));
		const showSummaryBtn = element(by.name("ctrl"));

		browser.wait(protractor.ExpectedConditions.visibilityOf(el), 1000);
		expect(el.getText()).toContain(translations.en.intro.title);
		expect(browser.isElementPresent(acceptBtn)).toEqual(true);
		expect(browser.isElementPresent(learnMoreBtn)).toEqual(true);
		expect(browser.isElementPresent(showSummaryBtn)).toEqual(true);

		Promise.all([
			popup.getSize(),
			popup.getLocation(),
			browser.driver
				.manage()
				.window()
				.getSize()
		]).then(([size, location, browserSize]) => {
			// check size of the modal
			expect(size.width).toEqual(browserSize.width);
			expect(size.height).toBeLessThanOrEqual(500);

			// check position of the modal
			expect(location.x).toBe(0);
			// expect(location.y).toBe((browserSize.height - size.height) / 2);
		});
	});

	it("should display correctly when layout is set to thin", () => {
		browser.get(`/?layout=thin`);
		browser.sleep(300);
		expect(
			browser.isElementPresent(element(by.css("[class^=title_title]")))
		).toEqual(false);
	});

	// Css / Theme
	it("should respect css.colorPrimary parameter correctly", () => {
		browser.get(`/?css.colorPrimary=${cssColor}`);
		browser.sleep(300);

		element(by.name("footerAccept"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toBe(cssColor);
			});

		element(by.name("footerReject"))
			.getCssValue("border-top-color")
			.then(val => {
				expect(val).toBe(cssColor);
			});

		element(by.name("footerReject"))
			.getCssValue("color")
			.then(val => {
				expect(val).toBe(cssColor);
			});

		element(by.name("footerReject")).click();
		

		element.all(by.css("[class^=CMP_purposes_purposeItem]")).then(els => {
			els[0].getCssValue("background-color").then(val => {
				expect(val).toBe(cssColor);
			});
			// Click first item to render CMP_switch_visualizationContainer and pass next test
			els[0].click(); 
		});

		element(by.css("[class^=CMP_switch_visualizationContainer]"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toBe(cssColor);
			});
	});

	it("should respect css.colorBorder parameter correctly", () => {
		browser.get(`/?css.colorBorder=${cssColor}`);
		browser.sleep(300);

		const popup = element(by.css("[class^=CMP_popup_content]"));

		popup.getCssValue("border-top-color").then(val => {
			expect(val).toBe(cssColor);
		});

		element(by.css("[class^=CMP_divider_divider]"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toBe(cssColor);
			});

		element(by.name("footerReject")).click();

		element
			.all(by.css("[class^=CMP_purposes_purposeItem]"))
			.first()
			.getCssValue("border-top-color")
			.then(val => {
				expect(val).toBe(cssColor);
			});
	});

	it("should respect css.colorBackground parameter correctly", () => {
		browser.get(`/?css.colorBackground=${cssColor}`);
		browser.sleep(300);
		element(by.css("[class^=CMP_popup_content]"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toEqual(cssColor);
			});
	});

	it("should respect css.colorTextPrimary parameter correctly", () => {
		browser.get(`/?css.colorTextPrimary=${cssColor}`);
		browser.sleep(300);

		const popup = element(by.css("[class^=CMP_popup_popup]"));

		// check intro
		element(by.css("[class^=CMP_title_title]"))
			.getCssValue("color")
			.then(val => {
				expect(val).toBe(cssColor);
			});

		popup.all(by.tagName("p")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(cssColor);
			});
		});

		// check summary
		element(by.name("ctrl")).click();

		popup.all(by.css("[class^=summary_subtitle]")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(cssColor);
			});
		});

		popup.all(by.tagName("li")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(cssColor);
			});
		});

		// check purposes
		element(by.name("footerReject")).click();
		element.all(by.css("[class^=CMP_purposes_purposeItem]"))
			.first()
			.click()
			
		element(by.css("[class^=CMP_purposes_switchText]"))
			.getCssValue("color")
			.then(val => {
				expect(val).toBe(cssColor);
			});
	});

	// Not used at this moment
	it("should respect css.colorTextSecondary parameter correctly", () => {
		browser.get(`/?css.colorTextSecondary=${cssColor}`);
		browser.sleep(300);
	});

	it("should respect css.colorLinkColor parameter correctly", () => {
		browser.get(`/?css.colorLinkColor=${cssColor}`);
		browser.sleep(300);

		const popup = element(by.css("[class^=CMP_popup_popup]"));

		// Check links in purposes
		element(by.name("footerReject")).click();
		popup.all(by.tagName("a")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(cssColor);
			});
		});

		// Check links in vendors
		element(by.id("detailsShowVendors")).click();
		popup.all(by.tagName("a")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(cssColor);
			});
		});
	});

	// Logo
	it("should display a logo when logoUrl is set", () => {
		const logoUrl = "https://www.freelogodesign.org/Content/img/logo-ex-4.png";

		browser.get(`/?logoUrl=${logoUrl}`);
		browser.sleep(300);

		const logoEl = element(by.id("companyLogo"));

		expect(browser.isElementPresent(logoEl)).toEqual(true);
		expect(logoEl.getAttribute("src")).toEqual(logoUrl);
	});

	// Block browsing
	it("should display an overlay when blockBrowsing is true", () => {
		browser.get(`/?blockBrowsing=true`);
		browser.sleep(300);
		expect(
			browser.isElementPresent(element(by.css("[class^=CMP_popup_overlay]")))
		).toEqual(true);
	});

	// Company name
	it("should contain the company name if specified in the config", () => {
		const companyName = "Roadrunner and Coyote Enterprises";
		browser.get(`/?companyName=${companyName}`);
		browser.sleep(300);
		const el = element(by.css("[class^=CMP_title_title]"));
		browser.wait(protractor.ExpectedConditions.visibilityOf(el), 1000);
		expect(el.getText()).toContain(companyName);
	});
});
