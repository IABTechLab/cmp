const utils = require("./support/utils");
const protractor = require("protractor");
const { browser, element, by } = protractor;

const colorPrimary = "rgba(115, 208, 244, 1)";
const colorSecondary = "rgba(234, 234, 234, 1)";
const colorBorder = "rgba(191, 0, 0, 1)";
const colorBackground = "rgba(255, 255, 255, 1)";
const colorTextPrimary = "rgba(51, 51, 51, 1)";
const fontFamily = `"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`;

describe(utils.suiteTitle("Customization"), () => {
	beforeEach(() => {
		utils.clearCookies();
		browser.waitForAngularEnabled(false);
	});

	// Css / Theme
	it("should respect css.colorPrimary parameter correctly", () => {
		browser.get(`/?css.colorPrimary=${colorPrimary}`);
		browser.sleep(300);

		element(by.name("footerAccept"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toBe(colorPrimary);
			});

		element(by.name("footerReject"))
			.getCssValue("border-top-color")
			.then(val => {
				expect(val).toBe(colorPrimary);
			});

		element(by.name("footerReject"))
			.getCssValue("color")
			.then(val => {
				expect(val).toBe(colorPrimary);
			});

		element(by.name("footerReject")).click();

		element.all(by.css("[class^=CMP_purposes_purposeItem]"))
			.last()
			.click();

		element.all(by.css("[class^=CMP_purposes_purposeItem]")).then(els => {
			els[els.length-1].getCssValue("background-color").then(val => {
				expect(val).toBe(colorBackground);
			});
		});

		element.all(by.css("[class^=CMP_purposes_purposeItem]"))
			.first()
			.click();
		
		element(by.css("[class^=CMP_switch_visualizationContainer]"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toBe(colorPrimary);
			});
	});

	it("should respect css.colorBorder parameter correctly", () => {
		browser.get(`/?css.colorBorder=${colorBorder}`);
		browser.sleep(300);

		const popup = element(by.css("[class^=CMP_popup_content]"));

		popup.getCssValue("border-top-color").then(val => {
			expect(val).toBe(colorBorder);
		});

		element(by.css("[class^=CMP_divider_divider]"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toBe(colorBorder);
			});

		element(by.name("footerReject")).click();

		element
			.all(by.css("[class^=CMP_purposes_purposeItem]"))
			.first()
			.getCssValue("border-top-color")
			.then(val => {
				expect(val).toBe(colorBorder);
			});
	});

	it("should respect css.colorBackground parameter correctly", () => {
		browser.get(`/?css.colorBackground=${colorBackground}`);
		browser.sleep(300);

		element(by.css("[class^=CMP_popup_content]"))
			.getCssValue("background-color")
			.then(val => {
				expect(val).toEqual(colorBackground);
			});
	});

	it("should respect css.colorSecondary parameter correctly", () => {
		browser.get(`/?css.colorSecondary=${colorSecondary}`);
		browser.sleep(300);

		element(by.name("footerReject")).click();
		
		element.all(by.css("[class^=CMP_purposes_purposeChevron]")).then(els => {
			els[0].getCssValue("border-top-color").then(val => {
				expect(val).toBe(colorSecondary);
			});
		});
	});

	it("should respect css.colorTextPrimary parameter correctly", () => {
		browser.get(`/?css.colorTextPrimary=${colorTextPrimary}`);
		browser.sleep(300);

		const popup = element(by.css("[class^=CMP_popup_popup]"));

		// check intro
		element(by.css("[class^=CMP_title_title]"))
			.getCssValue("color")
			.then(val => {
				expect(val).toBe(colorTextPrimary);
			});

		popup.all(by.tagName("p")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(colorTextPrimary);
			});
		});

		// check summary
		element(by.name("ctrl")).click();

		popup.all(by.css("[class^=summary_subtitle]")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(colorTextPrimary);
			});
		});

		popup.all(by.tagName("li")).each(el => {
			el.getCssValue("color").then(val => {
				expect(val).toBe(colorTextPrimary);
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
				expect(val).toBe(colorTextPrimary);
			});
	});

	it("should respect the css.fontFamily parameter correctly", () => {
		browser.get(`/?css.fontFamily=${fontFamily}`);
		browser.sleep(300);

		element(by.name("footerAccept"))
			.getCssValue("font-family")
			.then(val => {
				expect(val).toBe(fontFamily);
			});

		element(by.name("footerReject"))
			.getCssValue("font-family")
			.then(val => {
				expect(val).toBe(fontFamily);
			});

	});
});
